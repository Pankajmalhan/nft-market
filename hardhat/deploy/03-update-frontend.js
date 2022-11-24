const {
  frontEndContractsFile,
  frontEndAbiFile,
} = require("../helper-hardhat-config");
const fs = require("fs");
const { network } = require("hardhat");

module.exports = async () => {
  console.log("Writing to front end...");
  await updateContractAddresses("TFTToken");
  await updateContractAddresses("NftMarket");
  await updateAbi("TFTToken");
  await updateAbi("NftMarket");
  console.log("Front end written!");
};

async function updateAbi(contractName) {
  const raffle = await ethers.getContract(contractName);
  console.log(frontEndAbiFile);
  fs.writeFileSync(
    frontEndAbiFile + "_" + contractName + ".json",
    raffle.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses(contractName) {
  const raffle = await ethers.getContract(contractName);
  console.log(frontEndContractsFile);
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontEndContractsFile, "utf8")
  );
  if (network.config.chainId.toString() in contractAddresses[contractName]) {
    if (
      !contractAddresses[contractName][
        network.config.chainId.toString()
      ].includes(raffle.address)
    ) {
      contractAddresses[contractName][network.config.chainId.toString()].push(
        raffle.address
      );
    }
  } else {
    contractAddresses[contractName][network.config.chainId.toString()] = [
      raffle.address,
    ];
  }
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses));
}
module.exports.tags = ["all", "frontend"];
