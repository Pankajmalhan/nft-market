import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import { contractAddress, abi } from "../contract-constants";

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
    // const contract = new ethers.Contract(contractAddress, abi, signer);
    // setContract(contract);
  }

  useEffect(() => {
    if (address) {
      getNonce();
    }
  }, [address]);

  function getNonce() {
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(address),
      Headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Getting the nonce", res.message);
        setNonce(res.message);
      })
      .catch((err) => console.log(err));
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
        setNonce,
      }}
    >
      {children}
    </Provider>
  );
};

export { Web3Provider, Web3Context };
