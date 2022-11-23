// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error ItemPriceLessThanZero();
error ItemDoesNotExist();
error NeedToSpendMoreEth();
error ItemSold();
error TransferFailed();

contract MarketPlace is ReentrancyGuard {
    // State
    using Counters for Counters.Counter;
    Counters.Counter private _itemsId;

    address payable public immutable i_feeAccount; //the account that receives the fees
    uint public immutable i_feePercent; //the fee percentage on sales
    uint256 public immutable i_listing_Rate = 0.0001 ether;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool sold;
    }

    mapping(uint => Item) public items;

    // Events
    event NFTListed(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    event NFTSold(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        i_feeAccount = payable(msg.sender);
        i_feePercent = _feePercent;
    }

    function makeMarketItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price
    ) external nonReentrant {
        if (_price < 0) {
            revert ItemPriceLessThanZero();
        }
        // increment count
        uint256 newItemId = _itemsId.current();
        _itemsId.increment();

        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        // add new item
        items[newItemId] = Item(
            newItemId,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // emit event
        emit NFTListed(newItemId, address(_nft), _tokenId, _price, msg.sender);
    }

    function purchaseMarketItem(uint _itemId) external payable nonReentrant {
        if (_itemId < 0 && _itemId >= _itemsId.current()) {
            revert ItemDoesNotExist();
        }
        uint _totalPrice = getItemTotalPrice(_itemId);
        Item storage item = items[_itemId];

        if (msg.value < _totalPrice) {
            revert NeedToSpendMoreEth();
        }
        if (item.sold) {
            revert ItemSold();
        }

        (bool success, ) = item.seller.call{value: item.price}("");
        if (!success) {
            revert TransferFailed();
        }
        (success, ) = i_feeAccount.call{value: _totalPrice - item.price}("");
        if (!success) {
            revert TransferFailed();
        }

        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit NFTSold(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
    }

    // View/Pure Functions
    function getItemTotalPrice(uint _itemId) public view returns (uint) {
        return ((items[_itemId].price * (100 + i_feePercent)) / 100);
    }

    function getListingPrice() public pure returns (uint) {
        return i_listing_Rate;
    }

    function getCurrentTokenID() public view returns (uint) {
        return _itemsId.current();
    }
}
