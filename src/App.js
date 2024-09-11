import React, { useState } from "react";
import Web3 from "web3";
import abi from "./SimpleSignatureVerifierABI.json";

// Replace with your deployed contract address

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [signerAddress, setSignerAddress] = useState("");
  const [isValid, setIsValid] = useState(null);

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

  // Sign a message
  const signMessage = async () => {
    if (!web3 || !message) return;

    const messageHash = web3.utils.keccak256(message);

    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [messageHash, account],
    });
    console.log("signature  : ", signature);
    setSignature(signature);
  };

  // Verify the signature with the smart contract
  const verifySignature = async () => {
    if (!web3 || !message || !signature || !signerAddress) return;
    console.log(signerAddress, message, signature);

    try {
      //>>>>>>>>>>With help of contract

      // const contract = new web3.eth.Contract(
      //   abi,
      //   "0x5Bd9e60A07145a69543655E6fBeC7b841Dfce24C"
      // );
      // const blockNumber = await web3.eth.getGasPrice();
      // console.log(blockNumber);
      // const isValid = await contract.methods
      //   .verifySignature(signerAddress, message, signature)
      //   .call();

      //but can be done with web3 also

      const messageHash = web3.utils.keccak256(message);

      // Recover the signer address from the message and signature
      const recoveredAddress = web3.eth.accounts.recover(
        messageHash,
        signature
      );

      console.log("Recovered Address: ", recoveredAddress);

      // Check if the recovered address matches the provided signer address
      const isValid =
        recoveredAddress.toLowerCase() === signerAddress.toLowerCase();

      setIsValid(isValid);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <p>{account ? account : ""}</p>
      <h1>Signature Verifier</h1>
      <button onClick={initializeWeb3}>Connect MetaMask</button>
      <br />
      <br />
      <input
        type="text"
        placeholder="Message to Sign"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <br />
      <button onClick={signMessage}>Sign Message</button>
      <br />
      <br />
      <input
        type="text"
        placeholder="Signature"
        value={signature}
        readOnly
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <br />
      <input
        type="text"
        placeholder="Signer Address"
        value={signerAddress}
        onChange={(e) => setSignerAddress(e.target.value)}
        style={{ marginBottom: "10px", width: "300px" }}
      />
      <br />
      <button onClick={verifySignature}>Verify Signature</button>
      <br />
      <br />
      {isValid !== null && (
        <p>{isValid ? "Valid Signature!" : "Invalid Signature!"}</p>
      )}
    </div>
  );
};

export default App;
