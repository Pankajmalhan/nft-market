import { useContext, useEffect } from "react";
import { Web3Context } from "../context/Web3";

const ConnectButton = () => {
  const { connect, hasMetamask, isConnected, address } =
    useContext(Web3Context);

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await connect();
        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
  }, []);

  useEffect(() => {
    if (address) {
      api();
    }
  }, [isConnected, address]);

  async function api() {
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(address),
      Headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    localStorage.setItem("nonce", res.message.nonce);
  }

  return (
    <button
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium px-4 mx-2"
      onClick={connect}
    >
      {hasMetamask
        ? isConnected
          ? `${address.slice(0, 5)}...${address.slice(
              address.length - 5,
              address.length
            )}`
          : "Connect Wallet"
        : "Please install metamask"}
    </button>
  );
};

export default ConnectButton;
