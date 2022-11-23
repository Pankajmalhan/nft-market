import PrettyNavBar from "../components/PrettyNavBar";
import PrettyFooter from "../components/PrettyFooter";
import "../styles/globals.css";
import { Web3Provider } from "../context/Web3";
import { NFTProvider } from "../context/NFTs";

function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <NFTProvider>
        <PrettyNavBar />
        <Component {...pageProps} />
        <PrettyFooter />
      </NFTProvider>
    </Web3Provider>
  );
}

export default MyApp;
