import NFTCard from "@/components/NFTCard"
import useNFTMarket from "@/state/nft-market"

const OwnedPage = () => {
  const { ownedNFTs, ownedListedNFTs } = useNFTMarket()
  console.log("OWNED: ", ownedNFTs)

  return (
    <div className="flex w-full flex-col">
      {/* Owned NFTs */}
      <h1 className="font-bold !text-7xl">Owned NFTs</h1>
      <div className="flex flex-wrap">
        {ownedNFTs?.map((nft) => (
          <NFTCard className="mr-2 mb-2" key={nft.id} nft={nft} />
        ))}
      </div>
      {/* Onwed and Listed NFTs */}
      {ownedListedNFTs && ownedListedNFTs.length > 0 && (
        <>
          <div className="mt-2 relative !h-[1px] w-full flex-shrink-0 bg-black">
            <div className="absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2 transform bg-white px-2 font-mono font-semibold">
              LISTED
            </div>
          </div>
          <div className="flex flex-wrap">
            {ownedListedNFTs?.map((nft) => (
              <NFTCard className="mr-2 mb-2" key={nft.id} nft={nft} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default OwnedPage
