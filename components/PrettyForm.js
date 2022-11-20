import { useState, useContext } from "react";
import Image from "next/image";
import { Web3Context } from "../context/Web3";
import Web3 from "web3";

const PrettyForm = () => {
  const { nonce, isConnected, address } = useContext(Web3Context);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMinted, setIsMinted] = useState(false);

  const mintNFT = async (e) => {
    e.preventDefault();
    await handleNFTUpload();
  };

  const _mintNFT = async (e) => {
    e.preventDefault();
    //contract call on success show message and redirect to home
  };

  const handleSignMessage = async () => {
    try {
      let web3 = new Web3(window.ethereum);
      const signature = await web3.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        address,
        "" // MetaMask will ignore the password argument here
      );
      handleAuthenticate(address, signature);
    } catch (err) {
      console.log(err);
      alert("You need to connect wallet.");
    }
  };

  const handleAuthenticate = (publicAddress, signature) => {
    fetch(`/api/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
      });
  };

  const handleNFTUpload = async (e) => {
    handleSignMessage()
      .then(() => {
        sendImageToBackend()
          .then(() => {
            sendJsonToBackend(formData)
              .then(() => {
                alert("NFT Uploaded to IPFS");
                setIsMinted(true);
              })
              .catch((err) => alert(err));
          })
          .catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  };

  const sendJsonToBackend = async (formData) => {
    fetch("/api/metadata-upload", {
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => response.json())
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          jsonHash: res.data,
        }));
      })
      .catch((err) => console.log(err));
  };

  const sendImageToBackend = async () => {
    const data = new FormData();
    data.append("file", selectedFile);

    fetch("/api/image-upload", {
      method: "POST",
      body: data,
      Headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((res) =>
        setFormData((prev) => ({
          ...prev,
          imgHash: res.data,
        }))
      );
  };

  return (
    <div className="flex flex-col">
      <div className="self-center">
        <h1 class="my-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900">
          Mint your <span class="text-blue-600 dark:text-blue-500">NFT.</span>
        </h1>
      </div>
      <div className="flex justify-around items-center ml-10 gap-x-4">
        {selectedFile ? (
          <Image
            src={URL.createObjectURL(selectedFile)}
            width={1}
            height={1}
            alt="banner"
            className="w-1/2 h-[80vh] cursor-pointer"
          />
        ) : (
          <>
            <div className="flex items-center justify-center w-1/2">
              <label
                for="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  disabled={!isConnected}
                />
              </label>
            </div>
          </>
        )}
        <>
          <form className="w-full max-w-lg mr-20">
            {!isMinted ? (
              <>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-full px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-first-name"
                    >
                      Title
                    </label>
                    <input
                      className="block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="Axie Infinity"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    <p className="text-red-500 text-xs italic hidden">
                      Please fill out this field.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-password"
                    >
                      Description
                    </label>
                    <textarea
                      className="text-sm block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                      rows={7}
                      placeholder="Whats in your NFT?"
                      value={formData.desc}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desc: e.target.value,
                        }))
                      }
                    />
                    <p className="text-gray-600 text-xs italic">
                      Make it as long and as crazy as you'd like
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-city"
                    >
                      Health
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      type="number"
                      placeholder="87291"
                      value={formData.health}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          health: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-state"
                    >
                      Speed
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        value={formData.speed}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            speed: e.target.value,
                          }))
                        }
                      >
                        <option>Slow</option>
                        <option>Fast</option>
                        <option>Undefined</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-zip"
                    >
                      Attack
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-zip"
                      type="number"
                      placeholder="90210"
                      value={formData.attack}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attack: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  className="w-full px-4 py-4 mr-4 my-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg"
                  onClick={(e) => mintNFT(e)}
                >
                  Upload to IPFS
                </button>
              </>
            ) : (
              <>
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  for="grid-first-name"
                >
                  Enter Price
                </label>
                <input
                  className="block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="number"
                  placeholder="ETH"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
                <button
                  className="w-full px-4 py-4 mr-4 my-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg"
                  onClick={(e) => _mintNFT(e)}
                  disabled={!isConnected}
                >
                  Mint
                </button>
              </>
            )}
          </form>
        </>
      </div>
    </div>
  );
};

export default PrettyForm;
