import { CreationValues } from "@/modules/CreationPage/CreationForm"
import { Contract } from "ethers"
import NFT_MARKET_CONTRACT_ABI from "../../../../nft-marketplace-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import useSigner from "./signer"
import { TransactionResponse } from "@ethersproject/providers"
import useOwnedNFTs from "./useOwnedNFTs"

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string

const useNFTMarket = () => {

  const {signer} = useSigner()

  const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET_CONTRACT_ABI.abi, signer);

  const ownedNFTs = useOwnedNFTs()

  const createNFT = async (values: CreationValues) => {
    try {
      const data = new FormData()
      data.append("name", values.name)
      data.append("description", values.description)
      data.append("image", values.image!)

      const response = await fetch("/api/nft-storage", {
        method: "POST",
        body: data,
      })

      if (response.status === 201) {
        const json = await response.json()
        console.log("Token URI: ", json.uri)
        const tx: TransactionResponse = await nftMarket.createNFT(json.uri)
        await tx.wait();
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {createNFT, ...ownedNFTs}
}

export default useNFTMarket
