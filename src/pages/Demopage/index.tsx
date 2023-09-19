import { Trace } from 'analytics'
import { AutoColumn } from 'components/Column'
import { SwitchLocaleLink } from 'components/SwitchLocaleLink'
import { BUSD_BSC } from 'constants/tokens'
import { useDemoHook } from 'state/demo/hooks'
import styled from 'styled-components'

const PageWrapper = styled(AutoColumn)`
  padding-top: 68px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding: 48px 8px 0px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`
const Flex = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    gap:2rem;
`
const Text = styled.div`
    color: #000;
`

export default function Demopage() {
  const data = useDemoHook(BUSD_BSC?.address)

  const { chainId, balances, account, nativeBalance } = data
  
  return (
    <>
      <Trace shouldLogImpression>
        <PageWrapper gap="lg" justify="center">
            <Flex>
                <div style={{display:"flex", gap:"1rem"}}>
                  <Text>ChainId</Text>
                  <Text>{chainId}</Text>
                  
                </div>
                <div style={{display:"flex", gap:"1rem"}}>
                    <Text>Address</Text>
                    <Text>{account}</Text>
                </div>
                <div style={{display:"flex", gap:"1rem"}}>
                  <Text>Token address</Text>
                  <Text>{BUSD_BSC?.address}</Text>
                </div>
                <div style={{display:"flex", gap:"1rem"}}>
                  <Text>Token balance</Text>
                  <Text>{!balances[0]?.error && !balances[0]?.loading ? Number(balances[0]?.result?.toString())/Number(10**BUSD_BSC?.decimals) : "0" }</Text>
                </div>
                <div style={{display:"flex", gap:"1rem"}}>
                  <Text>Native balance</Text>
                  <Text>{nativeBalance}</Text>
                </div>
            </Flex>
        </PageWrapper>
      </Trace>
      <SwitchLocaleLink />
    </>
  )
}
