const { ethers, upgrades, network } = require("hardhat");

const { writeAddr } = require('./artifact_log.js');

const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

async function main() {
    let [owner] = await ethers.getSigners();

    const UpERC20 = await ethers.getContractFactory("UpERC20");
    let uperc20 = await upgrades.deployProxy(UpERC20);
    uperc20 = await uperc20.deployed();

    console.log("UpERC20 deployed to:", uperc20.address);

    await writeAddr(uperc20.address, "UpERC20", network.name);

    const currentImplAddress = await getImplementationAddress(ethers.provider, uperc20.address);
    console.log(`Please verify: npx hardhat verify ${currentImplAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });