const hre = require("hardhat");

async function main() {
  const Event= await hre.ethers.getContractFactory("Event");
  const event= await NFTMarket.deploy();
  await event.deployed();
  console.log("Event contract deployed to: ", event.address);
}