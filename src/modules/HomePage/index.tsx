import NFTCard from "@/components/NFTCard";
import useNFTMarket from "@/state/nft-market";

const HomePage = () => {

  const {listedNFTs} = useNFTMarket()

  return (
    <div className="flex flex-wrap">
      {listedNFTs?.map((nft) => (
        <NFTCard className="mr-2 mb-2" key={nft.id} nft={nft} />
      ))}
    </div>
  )
};

export default HomePage;
