import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Web3Context } from "./Web3";

const defaultValue = { NFTs: [] };
const NFTContext = React.createContext(defaultValue);

const { Provider, Consumer } = NFTContext;

const NFTProvider = ({ children }) => {
  const { contract, isConnected, network } = useContext(Web3Context);

  const [NFTs, setNFTS] = useState([]);
  const [ownedNFTs, setOwnedNFTs] = useState([]);

  const get_data = async (url) => {
    const m = await fetch(url);
    const n = await m.json();

    return n;
  };

  const getOwnedNFTs = async () => {
    const nft_response = await contract.getOwnedNfts();

    const nf = [];
    const c = await nft_response.map(async (res) => {
      console.log(res);
      let resp = await get_data(`https://ipfs.io/ipfs/${res._tokenURI}`);
      resp = {
        ...resp,
        id: Number(res.tokenId),
        price: Number(res.price._hex),
        creator: res.creator,
      };
      nf.push(resp);
      setOwnedNFTs(...ownedNFTs, nf);
    });
  };

  const getNFTsOnSale = async () => {
    const nft_response = await contract.getAllNftsOnSale();

    const nf = [];
    const c = await nft_response.map(async (res) => {
      let resp = await get_data(`https://ipfs.io/ipfs/${res._tokenURI}`);
      resp = { ...resp, price: Number(res.price._hex), creator: res.creator };
      nf.push(resp);
      setNFTS(...NFTs, nf);
    });
  };

  useEffect(() => {
    if (isConnected) {
      getNFTsOnSale();
      getOwnedNFTs();
    }
  }, [isConnected, network]);

  return <Provider value={{ NFTs, ownedNFTs }}>{children}</Provider>;
};

export { NFTProvider, NFTContext };
