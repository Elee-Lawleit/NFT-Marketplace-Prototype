import NFTCard from "@/components/NFTCard"
import useNFTMarket from "@/state/nft-market"

const OwnedPage = () => {
  const { ownedNFTs } = useNFTMarket()
  console.log("OWNED: ", ownedNFTs)

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-wrap">
        {ownedNFTs?.map((nft) => (
          <NFTCard className="mr-2 mb-2" key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default OwnedPage
