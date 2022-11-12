const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
const frontEndContractsFile = "../frontend/contract-constants/addresses.json";
const frontEndAbiFile = "../frontend/contract-constants/abi.json";

module.exports = {
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  frontEndContractsFile,
  frontEndAbiFile,
};
