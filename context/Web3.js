const axios = require("axios");
import { contractAddresses, abi } from "../contract-constants";
import Web3 from "web3";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const defaultValue = {};
const Web3Context = React.createContext(defaultValue);

const { Provider, Consumer } = Web3Context;

const chainIdToNetwork = {
  1: "Mainnet",
  5: "Goerli",
  31337: "Hardhat",
};

const Web3Provider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [chainId, setChainID] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const [network, setNetwork] = useState(undefined);
  const [provider, setProvider] = useState(undefined);
  const [nonce, setNonce] = useState(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
      window.ethereum.on("chainChanged", (e) => {
        setChainID(parseInt(e));
      });
      window.ethereum.on("accountsChanged", function (accounts) {
        setAddress(accounts[0]);
      });
    }
  });

  useEffect(() => {
    setNetwork(chainIdToNetwork[chainId]);
  }, [chainId]);

  async function setValues() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    setSigner(provider.getSigner());
    setChainID(window.ethereum.networkVersion);
    setAddress(await signer.getAddress());
    setNetwork(chainIdToNetwork[chainId]);
    setIsConnected(true);
    localStorage.setItem("isWalletConnected", true);

    const nftMarketContractAddress = contractAddresses[chainId][0];

    const NFTMarketContract = new ethers.Contract(
      nftMarketContractAddress,
      abi,
      signer
    );
    setContract(NFTMarketContract);
  }

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
        await setValues();
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function disconnect() {
    try {
      setProvider(undefined);
      setSigner(undefined);
      setChainID(undefined);
      setAddress(undefined);
      setNetwork(undefined);
      setIsConnected(undefined);
      setContract(undefined);
      localStorage.setItem("isWalletConnected", false);
    } catch (e) {
      console.log(e);
    }
  }

  async function handleSignIn() {
    if (address) {
      axios
        .post("/api/authenticate", {
          address: address,
        })
        .then(async (res) => {
          await handleAuthenticate(await handleSignMessage(res.data));
        })
        .then(handleAuthenticate)
        .catch((err) => console.log(err));
    }
  }

  function handleSignMessage({ publicAddress, nonce }) {
    return new Promise((resolve, reject) => {
      let web3 = new Web3(window.ethereum);
      setNonce(nonce);
      web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      );
    });
  }

  function handleAuthenticate({ publicAddress, signature }) {
    axios
      .post("/api/authenticate/verify", {
        publicAddress,
        signature,
      })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }

  return (
    <Provider
      value={{
        isConnected,
        hasMetamask,
        signer,
        chainId,
        connect,
        contract,
        address,
        network,
        provider,
        nonce,
        handleSignIn,
        isAuthenticated,
        disconnect,
      }}
    >
      {children}
    </Provider>
  );
};

export { Web3Provider, Web3Context };
