const { expect } = require("chai");
const { ethers } = require("hardhat");

let _contract = null;
let _nftPrice = ethers.utils.parseEther("0.3").toString();
let _listingPrice = ethers.utils.parseEther("0.025").toString();
let ownerAddress;
let address1;

describe('Box', function () {
    before(async () => {
        NftMarket = await ethers.getContractFactory("NftMarket");
        _contract = await NftMarket.deploy();
        await _contract.deployed();
    })

    describe("Mint token", () => {
        const tokenURI = "https://test.com";
        before(async () => {
            const [owner, addr1, addr2] = await ethers.getSigners();
            ownerAddress = owner.address;
            address1 = addr1.address;
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: ownerAddress,
                value: _listingPrice
            })
        })

        it("owner of the first token should be address[0]", async () => {
            const owner_ = await _contract.ownerOf(1);
            expect(owner_).to.be.equal(ownerAddress);
        })

        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);
            expect(actualTokenURI).to.be.equal(tokenURI);
        })

        it("should not be possible to create a NFT with used tokenURI", async () => {
            try {
                const obj = await _contract.mintToken(tokenURI, _nftPrice, {
                    from: ownerAddress
                })
            } catch (error) {
                expect(error).not.to.be.empty;
            }
        })

        it("should have one listed item", async () => {
            const listedItemCount = await _contract.listedItemsCount();
            expect(listedItemCount.toNumber()).to.be.equal(1);
        })

        it("should have create NFT item", async () => {
            const nftItem = await _contract.getNftItem(1);
            expect(nftItem.tokenId.toNumber()).to.be.equal(1, "Token id is not 1");
            expect(nftItem.price.toString()).to.be.equal(_nftPrice, "Nft price is not correct");
            expect(nftItem.creator).to.be.equal(ownerAddress, "Creator is not account[0]");
            expect(nftItem.isListed).to.be.true;
        })
    })

    describe("Buy NFT", () => {
        before(async () => {
            const secondAddressSigner = await ethers.getSigner(address1)
            await _contract.connect(secondAddressSigner).buyNft(1, {
                from: address1,
                value: _nftPrice
            })
        })

        it("should unlist the item", async () => {
            const listedItem = await _contract.getNftItem(1);
            expect(listedItem.isListed).not.to.be.true;
        })

        it("should decrease listed items count", async () => {
            const listedItemsCount = await _contract.listedItemsCount();
            expect(listedItemsCount.toNumber()).to.be.equal(0, "Count has not been decrement");
        })

        it("should change the owner", async () => {
            const currentOwner = await _contract.ownerOf(1);
            expect(currentOwner).to.be.equal(address1);
        })
    })

    describe("Token transfers", () => {
        const tokenURI = "https://test-json-2.com";
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: ownerAddress,
                value: _listingPrice
            })
        })

        it("should have two NFTs created", async () => {
            const totalSupply = await _contract.totalSupply();
            expect(totalSupply.toNumber()).to.be.equal(2, "Total supply of token is not correct");
        })

        it("should be able to retreive nft by index", async () => {
            const nftId1 = await _contract.tokenByIndex(0);
            const nftId2 = await _contract.tokenByIndex(1);

            expect(nftId1.toNumber()).to.be.equal(1, "Nft id is wrong");
            expect(nftId2.toNumber()).to.be.equal(2, "Nft id is wrong");
        })

        it("should have one listed NFT", async () => {
            const allNfts = await _contract.getAllNftsOnSale();
            expect(allNfts[0].tokenId.toNumber()).to.be.equal(2, "Nft has a wrong id");
        })

        it("account[1] should have one owned NFT", async () => {
            const secondAddressSigner = await ethers.getSigner(address1)
            const ownedNfts = await _contract.connect(secondAddressSigner).getOwnedNfts({ from: address1 });
            expect(ownedNfts[0].tokenId.toNumber()).to.be.equal(1, "Nft id is wrong");
        })

        it("account[0] should have one owned NFT", async () => {
            const ownedNfts = await _contract.getOwnedNfts({ from: ownerAddress });
            expect(ownedNfts[0].tokenId.toNumber()).to.be.equal(2, "Nft id is wrong");
        })
    })

    describe("Token transfer to new owner", () => {
        before(async () => {
            await _contract.transferFrom(
                ownerAddress,
                address1,
                2
            )
        })

        it("ownerAddress should own 0 tokens", async () => {
            const ownedNfts = await _contract.getOwnedNfts({ from: ownerAddress });
            expect(ownedNfts.length).to.be.equal(0, "Invalid length of tokens");
        })

        it("address1 should own 2 tokens", async () => {
            const secondAddressSigner = await ethers.getSigner(address1)
            const ownedNfts = await _contract.connect(secondAddressSigner).getOwnedNfts({ from: address1 });
            expect(ownedNfts.length).to.be.equal(2, "Invalid length of tokens");
        })
    })

    describe("List an Nft", () => {
        before(async () => {
            const secondAddressSigner = await ethers.getSigner(address1)
            await _contract.connect(secondAddressSigner).placeNftOnSale(
                1,
                _nftPrice, { from: address1, value: _listingPrice }
            )
        })

        it("should have two listed items", async () => {
            const listedNfts = await _contract.getAllNftsOnSale();
            expect(listedNfts.length).to.be.equal(2, "Invalid length of Nfts");
        })

        it("should set new listing price", async () => {
            await _contract.setListingPrice(_listingPrice, { from: ownerAddress });
            const listingPrice = await _contract.listingPrice();
            expect(listingPrice.toString()).to.be.equal(_listingPrice, "Invalid length of Nfts");
        })

    })
})