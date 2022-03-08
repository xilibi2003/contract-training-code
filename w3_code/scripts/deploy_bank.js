
const hre = require("hardhat");
const { writeAddr } = require('./artifact_log.js');

const ERC2612Addr = require(`../deployments/${network.name}/ERC2612.json`)



async function main() {
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy(ERC2612Addr.address);

  await bank.deployed();

  console.log("Bank deployed to:", bank.address);
  await writeAddr(bank.address, "Bank", network.name)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
