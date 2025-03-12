import { usePrivy, useWallets } from "@privy-io/react-auth"
import React, { useMemo } from "react"

const Wallet = () => {
  const { connectWallet } = usePrivy()
  const { ready, wallets } = useWallets()

  const [connectedWallet, chain] = useMemo(() => {
    let wallet = ""
    let chain = ""
    if (ready) {
      if (wallets?.length > 0) {
        // find connectorType === "coinbase_wallet"
        const coinbaseWallet = wallets.find((wallet) => wallet.connectorType === "coinbase_wallet")
        if (coinbaseWallet) {
          wallet = coinbaseWallet.address
          chain = coinbaseWallet.chainId
        }
      }
    }
    return [wallet, chain]
  }, [wallets, ready])

  const switchChain = async () => {
    if (ready && connectedWallet) {
      wallets[0].switchChain(8453)
    }
  }

  const sendTransaction = async () => {
    if (ready && connectedWallet) {
      const wallet = wallets[0]
      const provider = await wallet.getEthereumProvider()

      const transactionRequest = {
        to: wallet.address,
        value: 100000,
      }

      const transactionHash = await provider.request({
        method: "eth_sendTransaction",
        params: [transactionRequest],
      })

      console.log("transactionHash", transactionHash)
    }
  }

  return (
    <div>
      <button onClick={connectWallet}>Connect wallet</button>
      <div>wallet address = {connectedWallet}</div>
      <div>wallet chain = {chain}</div>
      <button onClick={switchChain}>Switch chain</button>
      <button onClick={sendTransaction}>Send transaction</button>
    </div>
  )
}

export default Wallet
