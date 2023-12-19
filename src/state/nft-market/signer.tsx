import { createContext, useContext, useEffect, useState } from "react"
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import { ReactNode } from "react"
import Web3Modal from "web3modal"

type SignerContextType = {
  signer?: JsonRpcSigner
  address?: string
  loading: boolean
  connectWallet: () => Promise<void>
}

const SignerContext = createContext<SignerContextType>({} as any)

//instead of writing useContext(SignerContext) every single time, we just write this which returns the same thing
const useSigner = () => useContext(SignerContext)

export const SignerProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>()
  const [address, setAddress] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(()=>{
    const web3mdoal = new Web3Modal();
    if(web3mdoal.cachedProvider) {
      connectWallet()
    }

  }, [])

  const connectWallet = async () => {
    setLoading(true)
    try {
      const web3modal = new Web3Modal({cacheProvider: true})
      const instance = await web3modal.connect()
      const provider = new Web3Provider(instance) //
      const signer = provider.getSigner()
      const address = await signer.getAddress()

      setSigner(signer)
      setAddress(address)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const contextValue = { signer, address, loading, connectWallet }

  return (
    <SignerContext.Provider value={contextValue}>
      {children}
    </SignerContext.Provider>
  )
}

export default useSigner
