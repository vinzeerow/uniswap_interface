import { useTokenContract } from "hooks/useContract"
import { useCallback } from "react"
import { useTransactionAdder } from "state/transactions/hooks"


export const useDemo = (tokenAddress: string, account:string) => {
    const contract = useTokenContract(tokenAddress)
    const addTransaction = useTransactionAdder()
    const handleApprove = useCallback(async () => {
      // await contract.approve(account, MaxUint256)
      // .then((res:TransactionResponse) => {
      //     addTransaction(res, {
      //       type: TransactionType.APPROVAL,
      //       tokenAddress,
      //       spender: account,
      //       amount: MaxUint256?.toString(),
      //     })
      //     return res?.hash
      // })
      // .catch((err) => {
      //     console.log(err)
      // })
      console.log("Chưa chạy được")
    }, [account, addTransaction, contract, tokenAddress])

    return { handleApprove }
}