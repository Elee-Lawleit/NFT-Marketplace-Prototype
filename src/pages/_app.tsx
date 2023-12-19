import type { AppProps } from "next/app"
import "react-toastify/dist/ReactToastify.css"
import Layout from "../components/Layout"
import "../styles/globals.css"
import { SignerProvider } from "@/state/nft-market/signer"

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SignerProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SignerProvider>
  )
}

export default MyApp
