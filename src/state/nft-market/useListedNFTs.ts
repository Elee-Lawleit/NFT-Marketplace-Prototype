import { gql, useQuery } from "@apollo/client"
import useSigner from "./signer"
import { NFT_MARKET_ADDRESS } from "./constants"
import { parseRawNFT } from "./helpers"
import { GetListedNFTs, GetListedNFTsVariables } from "./__generated__/GetListedNFTs"

//variables are the values we pass in, in this case the owner
const useListedNFTs = () => {
  const { address } = useSigner()

  const { data } = useQuery<GetListedNFTs, GetListedNFTsVariables>(
    GET_LISTED_NFTS,
    { variables: { currentAddress: address ?? "" }, skip: !address }
  )
  const listedNFTs = data?.nfts.map(parseRawNFT)

  return { listedNFTs }
}



const GET_LISTED_NFTS = gql`
  query GetListedNFTs($currentAddress: String!) {
    nfts(where: { 
      to: "${NFT_MARKET_ADDRESS}"
      from_not: $currentAddress 
      }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`

export default useListedNFTs
