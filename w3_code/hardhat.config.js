require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades');
// yarn run hardhat export-abi
require('hardhat-abi-exporter');



// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

  abiExporter: {
    path: './deployments/abi',
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: true,
  },

  networks: {
    dev: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
  }
};

