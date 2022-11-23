// contracts/OceanToken.sol
// SPDX-License-Identifier: MIT

pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TFTToken is ERC20Capped, ERC20Burnable, Ownable {
    uint256 public blockReward;
    uint256 public freeFaucetAmount;

    uint256 public lockTime = 15 minutes;

    event Withdrawal(address indexed to, uint256 indexed amount);
    event Deposit(address indexed from, uint256 indexed amount);

    mapping(address => uint256) nextAccessTime;
    uint256 public withdrawalAmount = 10 * (10**18);

    constructor(uint256 reward)
        ERC20("TFTToken", "TFT")
        ERC20Capped(10000000 * (10**decimals()))
    {
        uint256 ownerAmount = 100000 * (10**decimals());
        freeFaucetAmount = 5 * (10**(decimals()));
        _mint(msg.sender, ownerAmount);
        blockReward = reward * (10**decimals());
    }

    function _mint(address account, uint256 amount)
        internal
        virtual
        override(ERC20Capped, ERC20)
    {
        require(
            ERC20.totalSupply() + amount <= cap(),
            "ERC20Capped: cap exceeded"
        );
        super._mint(account, amount);
    }

    function getNewTokens(address account, uint256 amount) public payable {
        require(address(account) != address(0), "Account is not valid");
        require(msg.value >= 1 * (10**decimals()), "Add Transection Value");
        _mint(account, amount * (10**decimals()));
    }

    function getFreeTokens(address account) public {
        require(address(account) != address(0), "Account is not valid");
        require(
            msg.sender != address(0),
            "Request must not originate from a zero account"
        );
        require(
            balanceOf(address(owner())) >= withdrawalAmount,
            "Insufficient balance in faucet for withdrawal request"
        );
        require(
            block.timestamp >= nextAccessTime[msg.sender],
            "Insufficient time elapsed since last withdrawal - try again later."
        );

        nextAccessTime[msg.sender] = block.timestamp + lockTime;
        _mint(account, freeFaucetAmount);
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (
            from != address(0) &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10**decimals());
    }

    function setFreeFausetAmount(uint256 amount) public onlyOwner {
        freeFaucetAmount = amount * (10**decimals());
    }

    function getFreeFausetAmount() public view returns (uint256) {
        return freeFaucetAmount;
    }

    function setLockTime(uint256 amount) public onlyOwner {
        lockTime = amount * 1 minutes;
    }

    function destroy() public onlyOwner {
        address payable owner = payable(owner());
        selfdestruct(owner);
    }

    function withdraw() public onlyOwner {
        emit Withdrawal(msg.sender, balanceOf(address(this)));
        address payable owner = payable(owner());
        owner.transfer(address(this).balance);
    }

    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * (10**18);
    }
}
