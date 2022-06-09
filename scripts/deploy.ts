import { ethers } from "hardhat"

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)

  const Greeter = await ethers.getContractFactory("Greeter")
  const greeter = await Greeter.deploy("Hello, World!")

  const Token = await ethers.getContractFactory("Token")
  const token = await Token.deploy()

  const NDToken = await ethers.getContractFactory("NDToken")
  const ndToken = await NDToken.deploy("Nader Dabit Token", "NDT")

  await greeter.deployed()
  await token.deployed()
  await ndToken.deployed()

  console.log("Greeter deployed to: ", greeter.address)
  console.log("Token deployed to: ", token.address)
  console.log("NDToken deployed to: ", ndToken.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
