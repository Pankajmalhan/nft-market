import { ethers } from "ethers";
import { useContext } from "react";
import { Web3Context } from "../context/Web3";
import styles from "./PreetyCard.module.css";

const OwnerCard = ({ nft }) => {
  const { isConnected, contract, signer } = useContext(Web3Context);

  let image_ipfs = nft.image.substring(nft.image.lastIndexOf("/") + 1);
  nft.image = `https://ipfs.io/ipfs/${image_ipfs}`;

  const handleForSale = async () => {
    try {
      if (isConnected) {
        let contractWithSigner = contract.connect(signer);
        console.log(contractWithSigner);
        let tx = await contractWithSigner.placeNftOnSale(nft.id, nft.price, {
          value: ethers.utils.parseEther("0.025"),
        });
        await tx.wait();

        alert("NFT sent to MarketPlace");
        router.push("/");
      } else {
        alert("Please Connect");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div
        className="rounded overflow-hidden shadow-2xl m-4 flex flex-col justify-between"
        style={{
          width: "300px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
          margin: "2rem",
          padding: "1rem",
          borderRadius: "1rem",
          // width: 250,
        }}
      >
        <img
          className={styles.image + " w-full"}
          style={{
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16
            )}`,
            height: "50%",
          }}
          alt="example"
          src={nft.image}
        />
        <div className="px-6 pt-4">
          <div className="font-bold text-xl mb-2">{nft?.title}</div>
          <p className="text-gray-700 text-base">{nft?.description}</p>
        </div>
        <div className="flex flex-col items-around pb-5 pl-5">
          <div className="flex justify-between mt-4 space-x-3 md:mt-6 mr-4">
            <button
              className="inline-flex w-18 items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg"
              onClick={() => handleForSale()}
              disabled={nft.isListed}
            >
              {nft.isListed ? "Listed" : "Send to Market"}
            </button>
            <div className="flex justify-center items-center gap-x-2">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg">
                {nft.price} ETH
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerCard;
