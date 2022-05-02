// hardhat.config.js

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('@nomiclabs/hardhat-ethers');

 task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(`PUBLIC KEY: ${account.address}`);
  } 
});

 module.exports = {
  solidity: "0.8.4",
};
