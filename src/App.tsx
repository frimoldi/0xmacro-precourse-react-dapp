import React, { useState } from "react"
import { Button, Input, StackDivider, VStack } from "@chakra-ui/react"
import "./App.css"

import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import Token from "./artifacts/contracts/Token.sol/Token.json"
import { BigNumber, ethers } from "ethers"

const GREETER_ADDRESS = process.env.REACT_APP_GREETER_CONTRACT_ADDRESS as string
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS as string

function App() {
  const [greeting, setGreetingValue] = useState<string>()
  const [userAccount, setUserAccount] = useState<string>()
  const [amount, setAmount] = useState<BigNumber>()

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" })
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        GREETER_ADDRESS,
        Greeter.abi,
        provider
      )
      try {
        const data = await contract.greet()
        console.log("data: ", data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log("Balance: ", balance.toString())
    }
  }

  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(GREETER_ADDRESS, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(TOKEN_ADDRESS, Token.abi, signer)
      const transation = await contract.transfer(userAccount, amount)
      await transation.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  return (
    <VStack height="100vh" justifyContent="center" alignItems="center">
      <VStack
        style={{ width: "800px" }}
        spacing="5"
        divider={<StackDivider borderColor="gray.200" />}
      >
        <VStack>
          <Button onClick={fetchGreeting}>Fetch Greeting</Button>
          <Button onClick={setGreeting}>Set Greeting</Button>
          <Input
            onChange={(e) => setGreetingValue(e.target.value)}
            placeholder="Set greeting"
          />
        </VStack>
        <VStack>
          <Button onClick={getBalance}>Get Balance</Button>
          <Button onClick={sendCoins}>Send Coins</Button>
          <Input
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="Account"
          />
          <Input
            onChange={(e) => setAmount(BigNumber.from(e.target.value))}
            placeholder="Amount"
          />
        </VStack>
      </VStack>
    </VStack>
  )
}

export default App
