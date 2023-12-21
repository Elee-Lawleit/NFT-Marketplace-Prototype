import type { AppProps } from "next/app"
import "react-toastify/dist/ReactToastify.css"
import Layout from "../components/Layout"
import "../styles/globals.css"
import { SignerProvider } from "@/state/nft-market/signer"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <SignerProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SignerProvider>
    </ApolloProvider>
  )
}

export default MyApp
