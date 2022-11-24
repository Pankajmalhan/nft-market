// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract NftMarket is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    struct NftItem {
        uint256 tokenId;
        uint256 price;
        address creator;
        bool isListed;
        string _tokenURI;
    }

    uint256 public listingPrice = 0.025 ether;
    IERC20 public TFT;

    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint256 => NftItem) private _idToNftItem;

    event NftItemCreated(
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
    );

    constructor(address token) ERC721("CreaturesNFT", "CNFT") { TFT = IERC20(token); }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setListingPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be at least 1 wei");
        listingPrice = newPrice;
    }

    function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint256) {
        return _listedItems.current();
    }

    function tokenURIExists(string memory _tokenURI)
        public
        view
        returns (bool)
    {
        return _usedTokenURIs[_tokenURI] == true;
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        uint256 allItemsCounts = totalSupply();
        uint256 currentIndex = 0;
        NftItem[] memory items = new NftItem[](_listedItems.current());

        for (uint256 i = 0; i < allItemsCounts; i++) {
            uint256 tokenId = tokenByIndex(i);
            NftItem storage item = _idToNftItem[tokenId];

            if (item.isListed == true) {
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }

        return items;
    }

    function getOwnedNfts() public view returns (NftItem[] memory) {
        if (msg.sender != address(0)) {
            uint256 ownedItemsCount = ERC721.balanceOf(msg.sender);
            NftItem[] memory items = new NftItem[](ownedItemsCount);

            for (uint256 i = 0; i < ownedItemsCount; i++) {
                uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
                NftItem memory item = _idToNftItem[tokenId];
                item.creator = address(msg.sender);
                items[i] = item;
            }

            return items;
        } else {
            NftItem[] memory items = new NftItem[](0);
            return items;
        }
    }

    function mintToken(string memory _tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(!tokenURIExists(_tokenURI), "Token URI already exists");
        require(
            msg.value >= listingPrice,
            "Price must be equal to listing price"
        );

        _tokenIds.increment();
        _listedItems.increment();

        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        _createNftItem(newTokenId, price, _tokenURI);
        _usedTokenURIs[_tokenURI] = true;

        return newTokenId;
    }

    function buyNft(uint256 tokenId) public payable {
        uint256 price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);

        require(msg.sender != owner, "You already own this NFT");
        require(msg.value == price, "Please submit the asking price");

        _idToNftItem[tokenId].isListed = false;
        _listedItems.decrement();

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    function placeNftOnSale(uint256 tokenId, uint256 newPrice) public payable {
        require(
            ERC721.ownerOf(tokenId) == msg.sender,
            "You are not owner of this nft"
        );
        require(
            _idToNftItem[tokenId].isListed == false,
            "Item is already on sale"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _idToNftItem[tokenId].isListed = true;
        _idToNftItem[tokenId].price = newPrice;
        _listedItems.increment();
    }

    function _createNftItem(
        uint256 tokenId,
        uint256 price,
        string memory _tokenURI
    ) private {
        require(price > 0, "Price must be at least 1 wei");

        _idToNftItem[tokenId] = NftItem(
            tokenId,
            price,
            msg.sender,
            false,
            _tokenURI
        );

        emit NftItemCreated(tokenId, price, msg.sender, false);
    }

    function buyNftwithTFT(uint256 tokenId) public payable {
        uint256 price = _idToNftItem[tokenId].price;
        address owner = ERC721.ownerOf(tokenId);
        uint BuyerBalance = TFT.balanceOf(msg.sender);
        uint256 total_token = (price * 10) * (10**18);

        require(msg.sender != owner, "You already own this NFT");
        require(BuyerBalance > total_token, "Please buy more tokens");

        _idToNftItem[tokenId].isListed = false;
        _listedItems.decrement();

        _transfer(owner, msg.sender, tokenId);
        TFT.transfer(owner, total_token);
    }
}

