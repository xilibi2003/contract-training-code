const { ethers, network } = require("hardhat");


filter = {
  address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  topics: [
    ethers.utils.id("Deposit(address,uint256)")
  ]
}
ethers.provider.on(filter, (log) => {
  console.log(log)

  // const Event = new ethers.utils.Interface(["event Deposit(address from,uint256 value)"]);
  // let deposit = Event.parseLog(log);
  // console.log(deposit.args.from);
  // console.log(deposit.args.value);
})


// ethers.provider.on("error", (tx) => {
//   // Emitted when any error occurs
// });