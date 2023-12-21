import NFTCard from "@/components/NFTCard";
import useNFTMarket from "@/state/nft-market";

const OwnedPage = () => {

  const {ownedNFTs} = useNFTMarket()
  console.log("OWNED: ", ownedNFTs)

  return (
    <div className="flex w-full flex-col">
      {ownedNFTs?.map((nft) => <NFTCard nft={nft}/>)}
      Owned
    </div>
  );
};

export default OwnedPage;
