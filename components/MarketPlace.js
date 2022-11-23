import { Col, Row } from "antd";
import { useState, useEffect, useContext } from "react";
import { NFTContext } from "../context/NFTs";
import { Web3Context } from "../context/Web3";
import Card from "./PrettyCard";
import { EmptyPage } from "./PrettyProfile";

const MarketPlace = () => {
  const { address } = useContext(Web3Context);
  const { NFTs, getNFTsOnSale } = useContext(NFTContext);

  useEffect(() => {
    if (address) getNFTsOnSale();
  }, [address]);

  useEffect(() => {
    if (address) getNFTsOnSale();
  }, []);

  return (
    <>
      <div
        style={{
          margin: "1rem",
          padding: "1rem",
        }}
      >
        <Row
          gutter={16}
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {NFTs?.length > 0 ? (
            NFTs.map((nft, index) => <Card key={index} nft={nft} />)
          ) : (
            <div className="h-[55vh]">
              <EmptyPage />
            </div>
          )}
        </Row>
      </div>
    </>
  );
};
export default MarketPlace;
