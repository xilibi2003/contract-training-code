
const hre = require("hardhat");

async function main() {
  const testEvent = await hre.ethers.getContractFactory("testEvent");
  const test = await testEvent.deploy();
  await test.deployed();
  console.log("testEvent deployed to:", test.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
