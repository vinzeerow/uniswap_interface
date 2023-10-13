import { CurrencyAmount, Token } from '@tpvinh/sdk-core'
import { AllowanceTransfer, MaxAllowanceTransferAmount, PermitSingle } from '@uniswap/permit2-sdk'
import { useWeb3React } from '@web3-react/core'
import PERMIT2_ABI from 'abis/permit2.json'
import { Permit2 } from 'abis/types'
import { useContract } from 'hooks/useContract'
import { useSingleCallResult } from 'lib/hooks/multicall'
import ms from 'ms'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toReadableError, UserRejectedRequestError } from 'utils/errors'
import { getPERMIT2ADDRESS } from 'utils/getPERMIT2ADDRESS'
import { signTypedData } from 'utils/signing'
import { didUserReject } from 'utils/swapErrorToUserReadableMessage'

const PERMIT_EXPIRATION = ms(`30d`)
const PERMIT_SIG_EXPIRATION = ms(`30m`)

function toDeadline(expiration: number): number {
  return Math.floor((Date.now() + expiration) / 1000)
}

export function usePermitAllowance(token?: Token, owner?: string, spender?: string, chainId?:number) {
  const contract = useContract<Permit2>(getPERMIT2ADDRESS(chainId), PERMIT2_ABI)
  const inputs = useMemo(() => [owner, token?.address, spender], [owner, spender, token?.address])

  // If there is no allowance yet, re-check next observed block.
  // This guarantees that the permitAllowance is synced upon submission and updated upon being synced.
  const [blocksPerFetch, setBlocksPerFetch] = useState<1>()
  const result = useSingleCallResult(contract, 'allowance', inputs, {
    blocksPerFetch,
  }).result as Awaited<ReturnType<Permit2['allowance']>> | undefined

  const rawAmount = result?.amount.toString() // convert to a string before using in a hook, to avoid spurious rerenders
  const allowance = useMemo(
    () => (token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined),
    [token, rawAmount]
  )
  useEffect(() => setBlocksPerFetch(allowance?.equalTo(0) ? 1 : undefined), [allowance])

  return useMemo(
    () => ({ permitAllowance: allowance, expiration: result?.expiration, nonce: result?.nonce }),
    [allowance, result?.expiration, result?.nonce]
  )
}

interface Permit extends PermitSingle {
  sigDeadline: number
}

export interface PermitSignature extends Permit {
  signature: string
}

export function useUpdatePermitAllowance(
  token: Token | undefined,
  spender: string | undefined,
  nonce: number | undefined,
  onPermitSignature: (signature: PermitSignature) => void
) {
  const { account, chainId, provider } = useWeb3React()
  return useCallback(async () => {
    try {
      if (!chainId) throw new Error('missing chainId')
      if (!provider) throw new Error('missing provider')
      if (!token) throw new Error('missing token')
      if (!spender) throw new Error('missing spender')
      if (nonce === undefined) throw new Error('missing nonce')

      const permit: Permit = {
        details: {
          token: token.address,
          amount: MaxAllowanceTransferAmount,
          expiration: toDeadline(PERMIT_EXPIRATION),
          nonce,
        },
        spender,
        sigDeadline: toDeadline(PERMIT_SIG_EXPIRATION),
      }

      const { domain, types, values } = AllowanceTransfer.getPermitData(permit, getPERMIT2ADDRESS(chainId), chainId)
      const signature = await signTypedData(provider.getSigner(account), domain, types, values)
      onPermitSignature?.({ ...permit, signature })
      return
    } catch (e: unknown) {
      const symbol = token?.symbol ?? 'Token'
      if (didUserReject(e)) {
        throw new UserRejectedRequestError(`${symbol} permit allowance failed: User rejected signature`)
      }
      throw toReadableError(`${symbol} permit allowance failed:`, e)
    }
  }, [account, chainId, nonce, onPermitSignature, provider, spender, token])
}
