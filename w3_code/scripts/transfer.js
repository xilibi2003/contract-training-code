const { ethers, network } = require("hardhat");
// const delay = require('./delay');

const ERC20Addr = require(`../deployments/${network.name}/MyERC20.json`)


async function main() {

    let [owner, second] = await ethers.getSigners();

    let myerc20 = await ethers.getContractAt("MyERC20",
        ERC20Addr.address,
        owner);

    await myerc20.transfer(second.address, 1000);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


  // duration = 60;
  // await delay.advanceTime(ethers.provider, duration); 
  // await delay.advanceBlock(ethers.provider);