import { NFT } from "@/components/NFTCard"
import { GetOwnedNFTs_nfts } from "./__generated__/GetOwnedNFTs"
import { formatEther } from "ethers/lib/utils"

export const parseRawNFT = (raw: GetOwnedNFTs_nfts): NFT => {
  return {
    id: raw.id,
    owner: raw.price == "0" ? raw.to : raw.from,
    price: raw.price == "0" ? "0" : formatEther(raw.price).toString(),
    tokenURI: raw.tokenURI,
  }
}
