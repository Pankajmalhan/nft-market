// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error NeedtoSpendMoreEth();

contract MarketItem is ERC721URIStorage {
    //State
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //Immutable State
    uint256 public immutable i_minting_rate = 0.0025 ether;

    //Constructor
    constructor() ERC721("MarketItem", "TFT") {}

    //State Functions
    function awardItem(address player, string memory tokenURI)
        internal
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _tokenIds.increment();
        return newItemId;
    }

    function mintNFT(string memory _tokenURI) external payable returns (uint) {
        if (msg.value < i_minting_rate) {
            revert NeedtoSpendMoreEth();
        }
        return awardItem(msg.sender, _tokenURI);
    }

    //View/Pure Functions
    function getMintingPrice() public pure returns (uint) {
        return i_minting_rate;
    }
}
