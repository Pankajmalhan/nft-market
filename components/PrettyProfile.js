import { useState, useContext, useEffect } from "react";
import { NFTContext } from "../context/NFTs";
import Card from "./OwnerCard";
import {
  SketchOutlined,
  DollarOutlined,
  LogoutOutlined,
  RobotOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import emptyImage from "../public/empty_state.webp";
import Image from "next/image";
import { Web3Context } from "../context/Web3";

import { ethers } from "ethers";

export const EmptyPage = () => {
  return (
    <div className="flex items-center flex-col">
      <h1 className="font-semibold text-lg">
        The box is empty! Try changing the network?
      </h1>
      <Image src={emptyImage} alt="" className="w-1/2" />
    </div>
  );
};

const NotSoPrettyProfile = () => {
  const { isConnected, address } = useContext(Web3Context);
  const { ownedNFTs: NFTs, getOwnedNFTs } = useContext(NFTContext);
  const [openTab, setOpenTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function logoutHandle() {
    return setIsModalOpen(!isModalOpen);
  }

  useEffect(() => {
    if (address) {
      getOwnedNFTs();
    }
  }, [address]);

  const ProfileOptions = () => (
    <>
      <div className="items-start justify-start flex-col flex-wrap w-1/3 h-1/2">
        <div className="w-full h-full flex-row justify-center items-center  ">
          <div className="justify-evenly items-center flex">
            <img
              className=" w-1/3 h-1/3 rounded-full aspect-square	 "
              src="https://lumiere-a.akamaihd.net/v1/images/h_blackpanther_mobile_19754_57fe2288.jpeg?region=0,0,640,480"
              alt=""
            />
          </div>
          <ul
            className=" mb-0 list-none flex-wrap pt-3 pb-4 w-full"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto ">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full " +
                  (openTab === 1
                    ? "text-white bg-gray-700"
                    : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                <SketchOutlined
                  style={{ fontSize: "2rem", marginRight: "1rem" }}
                />
                My NFT's
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto ">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full " +
                  (openTab === 2
                    ? "text-white bg-gray-700"
                    : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                <DollarOutlined
                  style={{ fontSize: "2rem", marginRight: "1rem" }}
                />{" "}
                NFT's Sold
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto ">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full " +
                  (openTab === 3
                    ? "text-white bg-gray-700"
                    : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                <RobotOutlined
                  style={{ fontSize: "2rem", marginRight: "1rem" }}
                />{" "}
                Buy TFT Token
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto ">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full " +
                  (openTab === 4
                    ? "text-white bg-gray-700"
                    : "text-black-600 bg-white")
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(4);
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                <WalletOutlined
                  style={{ fontSize: "2rem", marginRight: "1rem" }}
                />{" "}
                Account
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto ">
              <a
                className={
                  "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal w-full text-black-600 bg-white hover:text-white hover:bg-red-500"
                }
                onClick={(e) => {
                  e.preventDefault();
                  logoutHandle();
                }}
                data-toggle="tab"
                href="#link4"
                role="tablist"
              >
                <LogoutOutlined
                  style={{ fontSize: "2rem", marginRight: "1rem" }}
                />{" "}
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );

  const ProfileCards = () => {
    const { tokenContract, address } = useContext(Web3Context);

    const [amount, setAmount] = useState(undefined);
    const [tfttokenBalance, setBal] = useState(0);

    const mintFreeTokens = async () => {
      try {
        let tx = await tokenContract.getFreeTokens(address);
        await tx.wait();
        console.log(tx);
      } catch (e) {
        console.log(e);
      }
    };

    const buyTFTtoken = async () => {
      try {
        let tx = await tokenContract.getNewTokens(address, amount, {
          value: ethers.utils.parseEther("3"),
        });
        await tx.wait();
        console.log(tx);
      } catch (e) {
        console.log(e);
      }
    };

    useEffect(() => {
      const getBal = async () => {
        try {
          let tx = await tokenContract.balanceOf(address);
          setBal(Number(tx._hex) / 10 ** 18);
        } catch (e) {
          console.log(e);
        }
      };
      getBal();
    }, []);

    return (
      <div className="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="px-4 py-5 flex-wrap">
          <div className="tab-content tab-space">
            <div className={openTab === 1 ? "block" : "hidden"} id="link1">
              <div className="flex flex-wrap justify-around">
                {NFTs?.length > 0 ? (
                  NFTs.map((nft, index) => <Card key={index} nft={nft} />)
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={openTab === 2 ? "block" : "hidden"} id="link2">
              <EmptyPage />
            </div>
            <div className={openTab === 3 ? "block" : "hidden"} id="link3">
              <div className="flex flex-wrap my-8 mx-3 mb-6 justify-center">
                <div>
                  <div className="text-2xl antialiased font-semibold font-serif underline underline-offset-8">
                    You have{" "}
                    <span className="text-red-500">{tfttokenBalance}</span> TFT
                    tokens
                  </div>
                  <button
                    className="w-full px-2 py-3 mr-4 my-6 text-m font-medium text-center text-white bg-gray-800 rounded-lg"
                    border-double
                    border-4
                    border-sky-500
                    onClick={mintFreeTokens}
                  >
                    Get Free tokens
                  </button>
                </div>
                <div className="w-full md:w-full my-12 px-3 mb-6 md:mb-0 flex justify-center">
                  <label
                    className=" font-bold mb-2 text-2xl mx-5  antialiased font-semibold font-serif"
                    for="grid-first-name"
                  >
                    Buy tokens
                  </label>
                  <input
                    className="block w-3/12 bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="grid-first-name"
                    placeholder="number of tokens"
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                  />
                </div>
                <button
                  className="w-3/12 px-2 py-3 mr-4 my-6 text-m font-medium text-center text-white bg-gray-800 rounded-lg"
                  border-double
                  border-4
                  border-sky-500
                  onClick={buyTFTtoken}
                >
                  Buy
                </button>
              </div>
              {/* <h1> You have {tfttokenBalance} TFT tokens </h1>
              <button onClick={mintFreeTokens}>Get Free tokens</button>
              <button onClick={buyTFTtoken}>Buy tokens</button>
              <input
                type="number"
                value={amount}
                className="border-2"
                onChange={(e) => setAmount(e.target.value)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col m-12">
        <div className="self-center">
          <h1 className="my-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900">
            {openTab === 1
              ? " My "
              : openTab === 2
              ? "NFTs"
              : openTab === 3
              ? "NFTs"
              : "My"}
            <span className="text-blue-600 dark:text-blue-500">
              {openTab === 1
                ? " NFTs"
                : openTab === 2
                ? " Sold"
                : openTab === 3
                ? " Bought"
                : " Account"}
            </span>
          </h1>
        </div>
        <div className="flex justify-around ml-8 gap-x-4">
          <ProfileOptions />
          <ProfileCards />
        </div>
      </div>
    </>
  );
};
export default NotSoPrettyProfile;
