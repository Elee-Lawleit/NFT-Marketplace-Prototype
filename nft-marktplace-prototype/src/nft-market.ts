//this is the mapping file
import {
  NFTMarket,
  NFTTransfer as NFTTransferEvent,
} from "../generated/NFTMarket/NFTMarket"
import { NFT } from "../generated/schema"

export function handleNFTTransfer(event: NFTTransferEvent): void {
  //create new NFT entity (row/document)
  const nft = new NFT(event.params.tokenId.toString())
  nft.to = event.params.to
  nft.from = event.params.from
  nft.price = event.params.price

  //binding to the contrac the event was emitted from
  const nftMarket = NFTMarket.bind(event.address)
  //getting tokenURI from the contract itself, even better honestly
  const tokenURI = nftMarket.tokenURI(event.params.tokenId)
  nft.tokenURI = tokenURI

  //finally save the nft entity in database, can think of it saving a row in sql, or a document in mongodb
  nft.save()
}
