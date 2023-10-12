import { ChainId } from '@phuphamdeltalabs/sdkcore'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'

export const getPERMIT2ADDRESS = (chainId?:number) => {
  if(chainId === ChainId?.ONUS_TEST) {
    return "0x134ad5AA7114eD1742860e1A5555Fe60f6ac678F"
  }
  return PERMIT2_ADDRESS
}