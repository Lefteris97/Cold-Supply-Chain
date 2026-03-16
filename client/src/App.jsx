import { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import contractDetails from './contracts/BlockchainAssignment.json';
import Lottie from 'lottie-react';  
import animationData from './assets/Animation - Trucks.json';
import Basic from './components/Basic';
import ForAdmin from './components/ForAdmin';
import ForSupplier from './components/ForSupplier';
import ForDistAndAud from './components/ForDistAndAud';

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [role, setRole] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = '0x4B705D647c6AB852a8b15bABc143c767f077Fb7e'; // <---- Replace with your deployed contract address

  // Mapping for roles
  const roleMapping = {
    '0xb2c1aaaf9f516585466c9876e2eaf06ee68751aad537b2a6fa22f473d03b58eb': 'Administrator',
    '0xb77c7d6bf62fa24fc205955093030c58325cd2d3d35fb486ede7594fb99635f5': 'Supplier',
    '0xa19d0db335544d3c3ec35c34b9b35a51bd4861f7162de07d5af409611794db04': 'Distributor',
    '0x45eccfe3ded836ac48522625d95e9587e4f194da947361bb0a0268fcbc01418a': 'Auditor'
  };

  useEffect(() => {
    const init = async () => {
      const currentProvider = detectCurrentProvider();

      if (currentProvider) {
        const web3Instance = new Web3(currentProvider);

        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();

        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(contractDetails.abi, contractAddress);
          
          setContract(contractInstance);

          await getBalance(accounts[0], web3Instance);
          await getRole(accounts[0], contractInstance);
        }
      }
      addWalletListener();
    };
    init();
  }, []);

  const detectCurrentProvider = () => {
    if (window.ethereum) {
      return window.ethereum;
    } else if (window.web3) {
      return window.web3.currentProvider;
    } else {
      console.log('Please install MetaMask');
      return null;
    }
  };

  const connectWallet = async () => {
    const currentProvider = detectCurrentProvider();

    if (currentProvider) {
      try {
        await currentProvider.request({ method: "eth_requestAccounts" });
        const web3Instance = new Web3(currentProvider);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setWalletAddress(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(contractDetails.abi, contractAddress);
        setContract(contractInstance);
        await getBalance(accounts[0], web3Instance);
        await getRole(accounts[0], contractInstance);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Please install MetaMask');
    }
  };

  const getBalance = async (address, web3Instance) => {
    if (!web3Instance) return;

    const balance = await web3Instance.eth.getBalance(address);

    setBalance(web3Instance.utils.fromWei(balance, "ether"));
  };

  const getRole = async (address, contractInstance) => {
    if (!contractInstance) return;

    const roleBytes32 = await contractInstance.methods.getUserRole(address).call();

    // Convert bytes32 role to string
    const roleString = roleMapping[roleBytes32] || "Unknown Role";
    setRole(roleString);
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          if (web3 && contract) {
            getBalance(accounts[0], web3);
            getRole(accounts[0], contract);
          }
        }
      });
    }
  };

  return (
    <>
      <div>
        {!walletAddress && ( 
          <div className='loginScreen'>
            <h1 className='title'>COLD-SUPPLY CHAIN</h1>
            <button className='connectBtn' onClick={connectWallet}>Connect Wallet</button>
            <Lottie animationData={animationData}/>
          </div>
        )}
      </div>
      {walletAddress && walletAddress.length > 0 && (
        <div className='container'>
          <div className='accInfo'>
            <h2>Account: {walletAddress}</h2>
            <h2>Balance: {balance} ETH</h2>
            <h2>Role: {role}</h2>
          </div>
          <hr className='line'/>
          <div className='basicActions'>
            <Basic web3={web3} contract={contract} />
          </div>
          <hr className='line'/>
          <div className='roleActions'>
            {role === 'Administrator' && (
              <div>
                <ForAdmin web3={web3} contract={contract} />
              </div>
            )}
            {role === 'Supplier' && (
              <div>
                <ForSupplier web3={web3} contract={contract} />
              </div>
            )}
            {role === 'Distributor' && (
              <div>
                <ForDistAndAud web3={web3} contract={contract}/>
              </div>
            )}
            {role === 'Auditor' && (
              <div>
                <ForDistAndAud web3={web3} contract={contract}/>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default App;