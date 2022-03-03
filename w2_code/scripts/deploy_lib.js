
const hre = require("hardhat");

async function main() {
  const ExLib = await hre.ethers.getContractFactory("ExSafeMath");
  const lib = await ExLib.deploy();
  await lib.deployed();
  console.log("lib deployed to:", lib.address);

  const TestExLib = await hre.ethers.getContractFactory("TestExLib", {
    libraries: {
      ExSafeMath: lib.address,
    },
  });

  const testEx = await TestExLib.deploy();
  await testEx.deployed();
  console.log("testEx deployed to:", testEx.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
