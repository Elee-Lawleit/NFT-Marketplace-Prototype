import { CreationValues } from "@/modules/CreationPage/CreationForm"
import { BigNumber, Contract } from "ethers"
import NFT_MARKET_CONTRACT_ABI from "../../../../nft-marketplace-contracts/artifacts/contracts/NFTMarket.sol/NFTMarket.json"
import useSigner from "./signer"
import { TransactionResponse } from "@ethersproject/providers"
import useOwnedNFTs from "./useOwnedNFTs"
import useOwnedListedNFTs from "./useOwnedListedNFTs"
import { NFT_MARKET_ADDRESS } from "./constants"
import useListedNFTs from "./useListedNFTs"
import { NFT } from "@/components/NFTCard"
import { parseEther } from "ethers/lib/utils"

const useNFTMarket = () => {
  const { signer } = useSigner()

  const nftMarket = new Contract(
    NFT_MARKET_ADDRESS,
    NFT_MARKET_CONTRACT_ABI.abi,
    signer
  )

  const ownedNFTs = useOwnedNFTs()
  const ownedListedNFTs = useOwnedListedNFTs()
  const listedNFTs = useListedNFTs()

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
        await tx.wait()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const listNFT = async (tokenId: string, price: BigNumber) => {
    const tx: TransactionResponse = await nftMarket.listNFT(tokenId, price)
    await tx.wait()
  }

  const cancelListing = async (tokenId: string) => {
    const tx: TransactionResponse = await nftMarket.cancelListing(tokenId)
    await tx.wait()
  }

  //grab the NFT that the user wants to buy
  const buyNFT = async (nft: NFT) => {
    //convert the eth price into wei
    const tx: TransactionResponse = await nftMarket.buyNFT(nft.id, {
      value: parseEther(nft.price),
    })
    await tx.wait()
  }

  return {
    createNFT,
    listNFT,
    cancelListing,
    buyNFT,
    ...ownedNFTs,
    ...ownedListedNFTs,
    ...listedNFTs,
  }
}

export default useNFTMarket
