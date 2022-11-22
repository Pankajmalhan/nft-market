import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Web3Context } from "./Web3";

const defaultValue = { NFTs: [] };
const NFTContext = React.createContext(defaultValue);

const { Provider, Consumer } = NFTContext;

const NFTProvider = ({ children }) => {
  const { contract, isConnected } = useContext(Web3Context);

  const [NFTs, setNFTS] = useState([]);

  const getValues = async () => {
    const nft_response = await contract.getAllNftsOnSale();

    const get_data = async (url) => {
      const m = await fetch(url);
      const n = await m.json();

      return n;
    };

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
      getValues();
    }
  }, [isConnected]);

  return <Provider value={{ NFTs }}>{children}</Provider>;
};

export { NFTProvider, NFTContext };
