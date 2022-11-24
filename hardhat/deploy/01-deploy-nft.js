const { getNamedAccounts, deployments, network, run } = require("hardhat");
const {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const token = await deploy("TFTToken", {
    from: deployer,
    args: [25],
    log: true,
    waitConfirmations: 1,
  });

  const raffle = await deploy("NftMarket", {
    from: deployer,
    args: [token.address],
    log: true,
    waitConfirmations: 1,
  });
};

module.exports.tags = ["all", "raffle"];
