import { useRouter } from "next/router";
import { ShoppingCartOutlined, DollarOutlined } from "@ant-design/icons";
import CountDown from "../../components/CountDown";
import styles from "../../styles/Details.module.css";
import { BigNumber, ethers } from "ethers";
import { useContext } from "react";
import { Web3Context } from "../../context/Web3";
import Web3 from "web3";

const DetailPage = () => {
  const { contract, isConnected, signer, tokenContract } =
    useContext(Web3Context);

  const router = useRouter();
  const nft = router.query;

  const handleTFTBuy = async () => {
    console.log("TFT BUY CKCed");
    try {
      if (isConnected) {
        let contractWithSigner = tokenContract.connect(signer);
        let tx = await contractWithSigner.transferToken(
          contract.address,
          nft.price
        );
        await tx.wait();

        console.log(nft);

        contractWithSigner = contract.connect(signer);
        tx = await contractWithSigner.buyNftwithTFT(nft.tokenId);
        await tx.wait();

        console.log(tx);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleBuyTokenETH = async () => {
    console.log("clicked");
    try {
      if (isConnected) {
        let contractWithSigner = contract.connect(signer);
        let tx = await contractWithSigner.buyNft(nft.price, {
          value: ethers.utils.parseEther(nft.price),
        });
        await tx.wait();
        console.log(tx);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "40%",
          alignItems: "center",
          margin: "5rem",
          padding: "1rem",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "1rem",
          height: "80%",
          // boxShadow:
          //   "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <img
          onClick={() => console.log("Hello")}
          className={styles.image}
          style={{
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16
            )}`,
          }}
          alt="example"
          src={nft.image}
        />
      </div>
      <div
        style={{
          width: "50%",
          alignItems: "center",
          // border: "1px solid black",
          margin: "5rem",
          marginLeft: "-3rem",
          padding: "1rem",
          borderRadius: "1rem",
          justifyContent: "center",
          alignItems: "center",
          height: "80%",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        }}
      >
        <div className={styles.additional}>
          <p>
            <span className={styles.cardName}>{nft.title}</span>
          </p>
          <p className="price">
            <span className={styles.price}>
              Current Price: {nft.price} Ethereum
            </span>
          </p>
          <CountDown />
        </div>
        <div className={styles.btnContainer}>
          <button
            className={
              "AddtoCart bg-gray-800 hover:bg-gray-400 text-white font-bold my-1 py-5 px-0 rounded-2xl w-4/12 m-6"
            }
            onClick={handleBuyTokenETH}
          >
            <DollarOutlined style={{ fontSize: "1.5rem" }} /> {nft.price} ETH
          </button>
          <button
            className={
              "buyNow bg-gray-800 hover:bg-gray-400 text-white font-bold my-1 py-5 px-0 rounded-2xl w-4/12 m-6"
            }
            onClick={() => handleTFTBuy()}
          >
            <DollarOutlined style={{ fontSize: "1.5rem" }} /> {nft.price - 2}{" "}
            TFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
