// src/pages/WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);

    const connectWallet = async () => {
        try {
            
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);

        // Save a flag to know the user connected manually
        localStorage.setItem('isWalletConnected', 'true');
        } catch (err) {
        console.error('Wallet connection error:', err);
        }
    };

    const resetConnection = async () => {
        if (window.ethereum) {
          try {
            // Clear permissions 
            await window.ethereum.request({
              method: 'wallet_requestPermissions',
              params: [{ eth_accounts: {} }],
            });
          } catch (err) {
            console.warn('Permission reset failed or not supported:', err);
          }
      
          await connectWallet();
        }
      };

  const disconnectWallet = () => {
    setWalletAddress(null);
    localStorage.removeItem('isWalletConnected');
  };

  useEffect(() => {
    const autoConnect = async () => {
      const isWalletConnected = localStorage.getItem('isWalletConnected');
      if (isWalletConnected === 'true' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      }
    };

    autoConnect();

    window.ethereum?.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        disconnectWallet();
      }
    });
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, disconnectWallet, resetConnection }}>
      {children}
    </WalletContext.Provider>
  );
};
