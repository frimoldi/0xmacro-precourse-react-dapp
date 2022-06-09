import "@nomiclabs/hardhat-waffle"
import { task, HardhatUserConfig } from "hardhat/config"
import dotenv from "dotenv"

dotenv.config({
  path: __dirname + "/.env",
})

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: process.env.ROPSTEN_PROVIDER_URL_HTTPS as string,
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`],
    },
  },
}

export default config
