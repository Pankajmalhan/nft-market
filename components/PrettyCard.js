import Link from "next/link";
import styles from "./PreetyCard.module.css";

const PrettyCard = ({ nft }) => {
  let image_ipfs = nft.image.substring(nft.image.lastIndexOf("/") + 1);
  nft.image = `https://ipfs.io/ipfs/${image_ipfs}`;
  return (
    <>
      <div
        className="rounded overflow-hidden shadow-2xl m-4"
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
          className={styles.image}
          style={{
            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(
              16
            )}`,
            width: "auto",
            height: "30%",
          }}
          alt="example"
          src={nft.image}
        />
        <div className="px-6 pt-4">
          <div className="font-bold text-xl mb-2">{nft?.title}</div>
          <p className="text-gray-700 text-base">{nft?.description}</p>
        </div>
        <div className="flex flex-col items-around pb-5 pl-5">
          <div className="flex justify-between mt-4 space-x-3 md:mt-6">
            <Link
              href={{
                pathname: `/nft/${nft.title}`,
                query: nft,
              }}
              className="inline-flex w-18 items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg"
            >
              Preview{" "}
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
            <div className="flex justify-center items-center gap-x-2">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg">
                {nft.price} ETH
              </button>
              <button className="inline-flex items-center px-4 py-2 mr-4 text-sm font-medium text-center text-white bg-gray-800 rounded-lg">
                {nft.price - 2} TFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrettyCard;
