/* eslint-disable react-hooks/rules-of-hooks */
import { Interface } from '@ethersproject/abi'
import { useWeb3React } from "@web3-react/core";
import ERC20ABI from 'abis/erc20.json'
import { Erc20Interface } from 'abis/types/Erc20'
import { useMultipleContractSingleData } from 'lib/hooks/multicall';
import { useNativeCurrencyBalances } from 'lib/hooks/useCurrencyBalance';


export function useDemoHook(contractAddress:string) {
  const { chainId, account } = useWeb3React()
  const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
  const tokenBalancesGasRequirement = { gasRequired: 185_000 }
  const nativeBalance = useNativeCurrencyBalances(account ? [account] : [])?.[account ?? '']?.toSignificant(3) || '0'
  const balances = useMultipleContractSingleData(
      [contractAddress],
      ERC20Interface,
      'balanceOf',
      [account],
      tokenBalancesGasRequirement
  )
  return {
    chainId,
    balances,
    account,
    nativeBalance
  }
}