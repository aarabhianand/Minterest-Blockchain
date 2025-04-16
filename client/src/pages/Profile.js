// src/components/Profile.js
import React, { useState } from 'react';
import { useWallet } from './walletContext'; 
import { BrowserProvider, Contract } from 'ethers';
import NFTMarketPlaceABI from '../NFTMarketPlace.json';

const Profile = () => {
  const { walletAddress, disconnectWallet, resetConnection } = useWallet();
  const [mintURI, setMintURI] = useState('');
  const [minting, setMinting] = useState(false);
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  const mintNFT = async () => {
    if (!mintURI) {
      alert('Please enter a URI');
      return;
    }

    if (!window.ethereum) {
      alert('MetaMask not found');
      return;
    }

    try {
      setMinting(true);

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, NFTMarketPlaceABI.abi, signer);

      const tx = await contract.mint(mintURI);
      await tx.wait();

      alert('NFT Minted Successfully!');
      setMintURI('');
    } catch (error) {
        if (error.code === 4001 || error.message.includes("user rejected")) {
            console.log("Transaction cancelled by user.");
            setMintURI('');
        }else if (error.code === 'CALL_EXCEPTION' && error.message.includes('estimateGas')) {
            alert('Minting failed: This NFT may have already been minted.');
            setMintURI('');
        } else {
            console.error(error);
            alert(`Minting failed`);
        }
      
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>User Profile</h2>

        {walletAddress ? (
          <>
            <p style={styles.walletText}>Connected Wallet:</p>
            <div style={styles.addressBox}>{walletAddress}</div>

            <button style={styles.disconnectButton} onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button style={styles.connectButton} onClick={resetConnection}>
            Connect Wallet
          </button>
        )}
        {walletAddress && (
        <div style={styles.mintSection}>
        <input
          type="text"
          placeholder="Enter NFT URI"
          value={mintURI}
          onChange={(e) => setMintURI(e.target.value)}
          style={styles.input}
        />
        <button
          style={{
            ...styles.button,
            backgroundColor: minting ? '#fff' : '#00f0ff',
            boxShadow: minting
              ? '0 0 10px #00f0ff55'
              : '0 0 12px #00f0ff, 0 0 20px #00f0ff',
            color: minting ? '#00f0ff' : '#000',
          }}
          onClick={mintNFT}
          disabled={minting}
        >
          {minting ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>

      )}
      </div>
      
    </div>
  );
};

export default Profile;



const styles = {
    wrapper: {
      position: 'relative',
      zIndex: 2, // make sure this is above any canvas or particles.js background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    },
    container: {
      background: 'transparent',
      borderRadius: '16px',
      padding: '3rem 2rem',
      width: '100%',
      maxWidth: '500px',
      boxShadow: '0 0 20px #00f0ff99',
      textAlign: 'center',
      color: '#00f0ff',
      zIndex: 3,
    },
    heading: {
      color:'#fff',
      fontSize: '2.2rem',
      marginBottom: '1.5rem',
      
    },
    walletText: {
      fontSize: '1rem',
      marginTop: '1rem',
      color: '#aaa',
    },
    addressBox: {
      fontSize: '0.9rem',
      margin: '0.5rem auto 1.5rem',
      padding: '0.5rem 1rem',
      border: '1px solid #00f0ff',
      borderRadius: '10px',
      backgroundColor: '#00000066',
      display: 'inline-block',
      textShadow: '0 0 4px #00f0ff',
    },
    mintSection: {
      marginTop: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    input: {
      padding: '0.6rem 1rem',
      width: '100%',
      maxWidth: '400px',
      borderRadius: '8px',
      border: '1px solid #00f0ff',
      background: '#0f0f1f',
      color: '#00f0ff',
      boxShadow: '0 0 8px #00f0ff55',
  
    },
    button: {
      marginTop: '1rem',
      padding: '0.7rem 1.6rem',
      fontSize: '1rem',
      backgroundColor:'transparent',
      cursor: 'pointer',
      borderRadius: '10px',
      border: 'none',
      color: '#000',
      fontWeight: 'bold',
      transition: 'all 0.3s ease-in-out',
    },
    disconnectButton: {
      marginBottom: '2rem',
      padding: '0.7rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      borderRadius: '10px',
      backgroundColor: 'transparent',
      color: '#fff',
      border: 'none',
      boxShadow: '0 0 12px #00f0ff, 0 0 20px #00f0ff',
      fontWeight: 'bold',
    },
    connectButton: {
      marginTop: '2rem',
      padding: '0.8rem 2rem',
      fontSize: '1.1rem',
      cursor: 'pointer',
      borderRadius: '10px',
      backgroundColor: 'transparent',
      color: '#fff',
      border: 'none',
      boxShadow: '0 0 12px #00f0ff, 0 0 20px #00f0ff',
      fontWeight: 'bold',
      zIndex: 5,
    },
  };
  