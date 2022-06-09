import React, { useState } from "react"
import { Button, Input, VStack } from "@chakra-ui/react"
import "./App.css"

import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json"
import { ethers } from "ethers"

const GREETER_ADDRESS = process.env.REACT_APP_GREETER_CONTRACT_ADDRESS as string

function App() {
  const [greeting, setGreetingValue] = useState<string>()

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

  return (
    <VStack height="100vh" justifyContent="center" alignItems="center">
      <VStack style={{ width: "800px" }} spacing="5">
        <Button onClick={fetchGreeting}>Fetch Greeting</Button>
        <Button onClick={setGreeting}>Set Greeting</Button>
        <Input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />
      </VStack>
    </VStack>
  )
}

export default App
