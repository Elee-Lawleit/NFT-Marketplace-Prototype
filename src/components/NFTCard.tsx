import classNames from "classnames"
import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { ipfsToHTTPS } from "../helpers"
import AddressAvatar from "./AddressAvatar"
import SellPopup from "./SellPopup"
import useSigner from "@/state/nft-market/signer"
import useNFTMarket from "@/state/nft-market"
import { formatEther, parseEther } from "ethers/lib/utils"

export type NFT = {
  id: string
  // Owner of NFT, if NFT is listed for sale, this will be the seller address
  owner: string
  // If price > 0, the NFT is for sale
  price: string
  tokenURI: string
}

type NFTMetadata = {
  name: string
  description: string
  imageURL: string
}

type NFTCardProps = {
  nft: NFT
  className?: string
}

const NFTCard = (props: NFTCardProps) => {
  const { nft, className } = props
  const { address } = useSigner()
  const [meta, setMeta] = useState<NFTMetadata>()
  const [loading, setLoading] = useState(false)
  const [sellPopupOpen, setSellPopupOpen] = useState(false)

  const { listNFT, cancelListing, buyNFT } = useNFTMarket()

  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataResponse = await fetch(ipfsToHTTPS(nft.tokenURI))
      if (metadataResponse.status != 200) return
      const json = await metadataResponse.json()
      setMeta({
        name: json.name,
        description: json.description,
        imageURL: ipfsToHTTPS(json.image),
      })
    }
    void fetchMetadata()
  }, [nft.tokenURI])

  const onButtonClick = async () => {
    if (owned) {
      if (forSale) onCancelClicked()
      else setSellPopupOpen(true)
    } else {
      if (forSale) onBuyClicked()
      else {
        throw new Error(
          "onButtonClick called when NFT is not owned and is not listed, should never happen"
        )
      }
    }
  }

  const onBuyClicked = async () => {
    setLoading(true)
    try {
      await buyNFT(nft)
    } catch (error) {
      console.log("Error buying NFT: ", error)
    }
    setLoading(true)
  }

  const onCancelClicked = async () => {
    setLoading(true)
    try {
      await cancelListing(nft.id)
    } catch (error) {
      console.log("Error cancelling listed NFT: ", error)
    }
    setLoading(false)
  }

  const onSellConfirmed = async (price: BigNumber) => {
    setSellPopupOpen(false)
    setLoading(true)
    try {
      await listNFT(nft.id, price)
    } catch (error) {
      console.log("Error listing NFT: ", error)
    }
    setLoading(false)
  }

  const forSale = nft.price != "0"
  const owned = nft.owner == address?.toLowerCase()

  return (
    <div
      className={classNames(
        "flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-xl border font-semibold shadow-sm",
        className
      )}
    >
      {meta ? (
        <img
          //this image url first gets converted from ipfs url to https and the directly passed in the image source
          src={meta?.imageURL}
          alt={meta?.name}
          className="h-80 w-full object-cover object-center"
        />
      ) : (
        <div className="flex h-80 w-full items-center justify-center">
          loading...
        </div>
      )}
      <div className="flex flex-col p-4">
        <p className="text-lg">{meta?.name ?? "..."}</p>
        <span className="text-sm font-normal">
          {meta?.description ?? "..."}
        </span>
        <AddressAvatar address={nft.owner} />
      </div>
      <button
        className="group flex h-16 items-center justify-center bg-black text-lg font-semibold text-white"
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading && "Busy..."}
        {!loading && (
          <>
            {!forSale && "SELL"}
            {forSale && owned && (
              <>
                <span className="group-hover:hidden">{nft.price} ETH</span>
                <span className="hidden group-hover:inline">CANCEL</span>
              </>
            )}
            {forSale && !owned && (
              <>
                <span className="group-hover:hidden">{nft.price} ETH</span>
                <span className="hidden group-hover:inline">BUY</span>
              </>
            )}
          </>
        )}
      </button>
      <SellPopup
        open={sellPopupOpen}
        onClose={() => setSellPopupOpen(false)}
        onSubmit={onSellConfirmed}
      />
    </div>
  )
}

export default NFTCard
