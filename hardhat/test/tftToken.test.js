const { expect } = require("chai");
const { ethers } = require("hardhat");

let _contract = null;
let ownerAddress;
let address1,address2;

describe('NFT Token', function () {
    before(async () => {
        const [owner, addr1, addr2] = await ethers.getSigners();
        ownerAddress = owner.address;
        address1 = addr1.address;
        address2 = addr2.address;

        TFTToken = await ethers.getContractFactory("TFTToken");
        _contract = await TFTToken.deploy(1);
        await _contract.deployed();
    })

    describe('Check Deployed Contract', function () {
        it("owner balance should be 100000", async () => {
            let ownerBalance = ethers.utils.parseEther("100000").toString();
            const _balance = await _contract.balanceOf(ownerAddress);
            expect(_balance.toString()).to.be.equal(ownerBalance.toString());
        })

        it("check miner reward", async () => {
            let _reward = ethers.utils.parseEther("1").toString();
            const _value = await _contract.blockReward();
            expect(_value.toString()).to.be.equal(_reward.toString());
        })

        it("free faucet amount", async () => {
            let _reward = ethers.utils.parseEther("5").toString();
            const _value = await _contract.freeFaucetAmount();
            expect(_value.toString()).to.be.equal(_reward.toString());
        })
    })

    describe('Test Free Tokens', function () {
        it("intial balance should be 0", async () => {
            let _value = ethers.utils.parseEther("0").toString();
            const _balance = await _contract.balanceOf(address1);
            expect(_balance.toString()).to.be.equal(_value.toString());
        })

        it("get some free tokens", async () => {
            const secondAddressSigner = await ethers.getSigner(address1)
            let _reward = ethers.utils.parseEther("5").toString();
            const _value = await _contract.connect(secondAddressSigner).getFreeTokens(address1);
            const _balance = await _contract.balanceOf(address1);
            expect(_reward.toString()).to.be.equal(_balance.toString());
        })

        it("try to get tokens before 15 mins", async () => {
            try {
                const secondAddressSigner = await ethers.getSigner(address1)
                let _reward = ethers.utils.parseEther("5").toString();
                const _value = await _contract.connect(secondAddressSigner).getFreeTokens(address1);
                const _balance = await _contract.balanceOf(address1);
                expect(_reward.toString()).to.be.equal(_balance.toString());
            } catch (error) {
                expect(error).not.to.be.empty;
                expect(error.toString()).includes("Insufficient time elapsed since last withdrawal");

                let _reward = ethers.utils.parseEther("5").toString();
                const _balance = await _contract.balanceOf(address1);
                expect(_reward.toString()).to.be.equal(_balance.toString());
            }
        })
        
    })

    describe('Test Purchase Tokens', function () {
        it("intial balance should be 0", async () => {
            let _value = ethers.utils.parseEther("0").toString();
            const _balance = await _contract.balanceOf(address2);
            expect(_balance.toString()).to.be.equal(_value.toString());
        })

        it("purchase new tokens", async () => {
            const secondAddressSigner = await ethers.getSigner(address2)
            let _reward = ethers.utils.parseEther("100").toString();
            let payAmountForToken = ethers.utils.parseEther("10").toString();
            const _value = await _contract.connect(secondAddressSigner).getNewTokens(address2,100,{
                value: payAmountForToken
            });
            const _balance = await _contract.balanceOf(address2);
            expect(_reward.toString()).to.be.equal(_balance.toString());
        })

        
    })
    
})