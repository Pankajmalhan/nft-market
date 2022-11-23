const chai = require("chai");
const { expect, assert } = require("chai");
const eventemitter2 = require("chai-eventemitter2");
chai.use(eventemitter2());
const { ethers } = require("hardhat");

describe("NFT MARKETPLACE ", () => {
  let market, marketplaceContract, player1, player2, deployer, nft, nftContract;

  beforeEach(async () => {
    accounts = await ethers.getSigners(); // could also do with getNamedAccounts
    deployer = accounts[0];
    player1 = accounts[1];
    player2 = accounts[2];
    await deployments.fixture(["nftmarket"]); // Deploys modules with the tags given

    marketplaceContract = await ethers.getContract("MarketPlace");
    nftContract = await ethers.getContract("MarketItem");

    nft = nftContract.connect(player1);
    market = marketplaceContract.connect(player1);
  });

  describe("Minting and Listing Rate", function () {
    it("getting the correct minting and listing rate", async () => {
      const mintingRate = (await nft.getMintingPrice()).toString();
      assert.equal(mintingRate, "2500000000000000");

      const listingRate = (await market.getListingPrice()).toString();
      assert.equal(listingRate, "100000000000000");
    });
  });

  describe("Making MarketPlace Items", function () {
    beforeEach(async () => {
      const URI = "Sample URI";
      const id = await nft.mintNFT(URI, {
        value: (await nft.getMintingPrice()).toString(),
      });
      await nft.setApprovalForAll(market.address, true);
    });
    it("should track minted NFT then transfer to MarketPlace then emit event", async () => {
      await expect(
        market.makeMarketItem(
          nft.address,
          0,
          ethers.utils.formatUnits(1, "wei")
        )
      ).to.emit(market, "NFTListed", {
        withArgs: [
          0,
          nft.address,
          0,
          ethers.utils.formatUnits(1, "wei"),
          player1.address,
        ],
      });

      const convertBigNumberToNumber = (bn) => Number(bn._hex);

      const currentId =
        convertBigNumberToNumber(await market.getCurrentTokenID()) - 1;

      expect(await nft.ownerOf(currentId)).to.equal(market.address); // is the owner moved from minter to market?

      const item = await marketplaceContract.items(0);
      expect(convertBigNumberToNumber(item.itemId)).to.equal(0); // is the itemId correct?
      expect(item.nft).to.equal(nft.address); // is the nft contract correct?
      expect(convertBigNumberToNumber(item.tokenId)).to.equal(currentId); // if tokenIds match
      expect(convertBigNumberToNumber(item.price)).to.equal(1); // if price is 1 wei
      expect(item.sold).to.equal(false); // if the nft is sold or not
    });
    it("should fail since price is set to zero", async () => {
      await expect(market.makeMarketItem(nft.address, 1, 0)).to.be.reverted;
    });
  });

  describe("Purchasing Market Item", function () {
    let id;
    let price = 2;
    beforeEach(async () => {
      const URI = "Sample URI";
      id = await nft.mintNFT(URI, {
        value: (await nft.getMintingPrice()).toString(),
      });
      await nft.setApprovalForAll(market.address, true);
      await market.makeMarketItem(
        nft.address,
        0,
        ethers.utils.formatUnits(price, "wei")
      );
    });
    it("should fail since wrong item id", async () => {
      const priceInWei = await market.getItemTotalPrice(0);
      await expect(
        market.purchaseMarketItem(4, {
          value: priceInWei,
        })
      ).to.be.reverted;
    });
    it("should fail since value given is less than totalPrice", async () => {
      const convertBigNumberToNumber = (bn) => Number(bn._hex);
      const priceInWei = await market.getItemTotalPrice(0);

      await expect(
        market.purchaseMarketItem(0, {
          value: convertBigNumberToNumber(priceInWei) - 1,
        })
      ).to.be.reverted;
    });
    it("should be able to buy since price is equal to totalPrice", async () => {
      const convertBigNumberToNumber = (bn) => Number(bn._hex);
      const priceInWei = await market.getItemTotalPrice(0);

      await expect(
        market.purchaseMarketItem(0, {
          value: convertBigNumberToNumber(priceInWei),
        })
      ).to.not.be.reverted;
    });
    it("should fail since item is sold", async () => {
      const convertBigNumberToNumber = (bn) => Number(bn._hex);
      const priceInWei = await market.getItemTotalPrice(0);

      await market.purchaseMarketItem(0, {
        value: convertBigNumberToNumber(priceInWei),
      });

      await expect(
        market.purchaseMarketItem(0, {
          value: convertBigNumberToNumber(priceInWei),
        })
      ).to.be.reverted;
    });
    it("should be emiting an event", async () => {
      price = await market.getItemTotalPrice(0);

      await expect(
        market.connect(player2).purchaseMarketItem(1, { value: price })
      ).to.emit(market, "NFTSold");
    });
  });
});
