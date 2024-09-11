import React, { useState } from "react";
import Web3 from "web3";
import abi from "./SimpleSignatureVerifierABI.json";

// Replace with your deployed contract address

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");

  // Initialize web3
  const initializeWeb3 = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0].toLowerCase());
    } else {
      alert("Please install MetaMask!");
    }
  };

  async function mint() {
    const myContract = new web3.eth.Contract(
      abi,
      "0xaaB8199a4cd01518Ed4a493A1749F06bE6b50edd"
    );

    //First use case : lazyminting
    //Below is hardcoded, but we will receive this from backend. Suppose after login flow (i.e also with sign message done in master branch ) req come to backend then on backend
    //we will generarate a the below array and send on frontend. this transaction will be signed at backend pvt key but will be executed by wallet holder on frontend
    //This is lazyminting

    //Second use case : White listing a lot of user with some amount of NFTs
    //So the whole flow of application is below
    //User will login it is disscussed in master branch. We will having addressess and amount in our db. Loggedin Flow
    // So user that is coming is now logged in. He will now press claim, so as soon as he press claim he an api is called, we check is this is whitelisted by
    // admin or not. If it is whitelisted there will an ebtry of address quantity (For our case let we have assumed that it is one every time. But it can be multiple). I will 
    //prepare the below struct give the next tokenId, amount of eth (price of nft) , tokenUri, userAddress(whom to pay), make a signature of that and return in 
    //Api . This will be now executed by the wallet holder on frintend and he will receive the NFT. We can white list as many number of NFTs like 10000 NFTS
    //to multiple user. We can mint multiple number of NFTs to a single user. Manipulate the struct accordingley



    //Now taken from index.js outside src folder. 
    const args = [
      29,
      50,
      "uri",
      "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      "0xa8e57709dacca3a46d74f2e2d3a5f15c399d6012a5a91f3ddebf04ca435c25de217ab782ef63d5cbddb2f71d3182821b09ed4a1ea11141b36197c340bb226cf31c",
    ];
    const tx = myContract.methods.safeMint(args);
    const value = "50";
    const gas = await tx.estimateGas({ from: account, value });

    const gasPrice = await web3.eth.getGasPrice();

    const result = await tx.send({ from: account, value, gas, gasPrice });

    console.log(result, "+++++++++++++++++++++++++++++");
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>{account ? account : ""}</p>

      <button onClick={initializeWeb3}>Connect MetaMask</button>
      <button onClick={mint}>Mint</button>
    </div>
  );
};

export default App;
