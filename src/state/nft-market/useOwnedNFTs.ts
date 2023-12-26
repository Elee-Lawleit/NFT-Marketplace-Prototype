import { gql, useQuery } from "@apollo/client"
import {
  GetOwnedNFTs,
  GetOwnedNFTsVariables,
  GetOwnedNFTs_nfts,
} from "./__generated__/GetOwnedNFTs"
import useSigner from "./signer"
import { NFT } from "@/components/NFTCard"
import { parseEther } from "ethers/lib/utils"

//variables are the values we pass in, in this case the owner
const useOwnedNFTs = () => {
  const { address } = useSigner()

  const { data } = useQuery<GetOwnedNFTs, GetOwnedNFTsVariables>(
    GET_OWNED_NFTS,
    { variables: { owner: address ?? "" }, skip: !address }
  )
  const ownedNFTs = data?.nfts.map(parseRawNFT)

  return {ownedNFTs}
}

const parseRawNFT = (raw: GetOwnedNFTs_nfts): NFT =>{
  return {
    id: raw.id,
    owner: raw.price == "0" ? raw.to : raw.from,
    price: raw.price == "0" ? "0" : parseEther(raw.price).toString(),
    tokenURI: raw.tokenURI
  }
}

const GET_OWNED_NFTS = gql`
  query GetOwnedNFTs($owner: String!) {
    nfts(where: { to: $owner }) {
      id
      from
      to
      tokenURI
      price
    }
  }
`

export default useOwnedNFTs
