const { getNamedAccounts, deployments, network, run } = require("hardhat");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const one = await deploy("MarketItem", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  const two = await deploy("MarketPlace", {
    from: deployer,
    args: [10],
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["all", "nftmarket"];
