import { useEffect, useState } from "react";
import {
  connectWallet,
  getCurrentWalletConnected,
  setApproval,
  transferToken,
  retriveToken
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");


  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenID, setTokenID] = useState("");

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };


  const onSetApprovalPressed = async () => {
    const { success, status } = await setApproval(tokenAddress);
    setStatus(status);
  };

  const onTransferPressed = async () => {
    const { success, status } = await transferToken(tokenAddress, parseInt(tokenID));
    setStatus(status);
    if (success) {
      setTokenAddress("");
      setTokenID("");
    }
  };

  const onRetrivePressed = async () => {
    const { success, status } = await retriveToken(tokenAddress, parseInt(tokenID));
    setStatus(status);
    if (success) {
      setTokenAddress("");
      setTokenID("");
    }
  };


  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">NFT Splitter</h1>
      <form>
        <h2> Contract address: </h2>
        <input
          type="text"
          placeholder="Address"
          onChange={(event) => setTokenAddress(event.target.value)}
        />
        <h2>Token ID: </h2>
        <input
          type="text"
          placeholder="0"
          onChange={(event) => setTokenID(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onSetApprovalPressed}>
        Set approval
      </button>
      <button id="mintButton" onClick={onTransferPressed}>
        Transfer NFT
      </button>
      <button id="mintButton" onClick={onRetrivePressed}>
        Retrive NFT
      </button>
      <p id="status" style={{ color: "red" }}>
        {status}
      </p>
    </div>
  );
};

export default Minter;
