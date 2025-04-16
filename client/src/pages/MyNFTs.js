import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider, Contract, parseEther } from 'ethers';
import NFTMarketPlaceABI from '../NFTMarketPlace.json';
import { useWallet } from './walletContext';

const MyNfts = () => {
  const { walletAddress } = useWallet();
  const [marketplace, setMarketplace] = useState(null);
  const [myNFTs, setMyNFTs] = useState([]);
  const [priceInputs, setPriceInputs] = useState({});
  const [selectedNFT, setSelectedNFT] = useState(null);

  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    async function initContract() {
      if (!walletAddress || !window.ethereum) return;

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, NFTMarketPlaceABI.abi, signer);
      setMarketplace(contract);
    }
    initContract();
  }, [CONTRACT_ADDRESS, walletAddress]);

  useEffect(() => {
    if (walletAddress && marketplace) fetchMyNFTs();
  }, [walletAddress, marketplace]);

  const fetchMyNFTs = async () => {
    try {
      const nfts = await marketplace.myNFTs();
      const nftData = await Promise.all(
        nfts.map(async (id) => {
          const uri = await marketplace.getURI(id);
          const nft = await marketplace.nfts(id);
          return {
            id: id.toString(),
            uri,
            listed: nft.listed,
            price: nft.price.toString(),
          };
        })
      );
      setMyNFTs(nftData);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const deleteNFT = async (id) => {
    try {
      const tx = await marketplace.deleteNFT(id);
      await tx.wait();
      alert(`NFT ${id} deleted!`);
      fetchMyNFTs();
      setSelectedNFT(null);
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("user rejected")) return;
      alert("Failed to delete NFT");
    }
  };

  const listNFT = async (id) => {
    try {
      const price = priceInputs[id];
      if (!price || isNaN(price) || price <= 0) {
        alert("Enter a valid price.");
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = (await signer.getAddress()).toLowerCase();
      const balance = await provider.getBalance(userAddress);
      const balanceInEth = parseFloat(ethers.formatEther(balance));
      if (balanceInEth < 0.01) {
        alert(`Insufficient ETH balance.`);
        return;
      }

      const tx = await marketplace.listNFTforsale(id, parseEther(price), {
        value: parseEther("0.01"),
      });
      await tx.wait();
      alert(`NFT listed for ${price} ETH!`);
      fetchMyNFTs();
      setPriceInputs({});
      setSelectedNFT((prevNFT) => ({
        ...prevNFT,
        price: parseEther(price).toString(),
        listed: true,
      }));
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("user rejected")) return;
      alert("Failed to list NFT: " + err.message);
    }
  };

  const updatePrice = async (id) => {
    try {
      const price = priceInputs[id];
      if (!price || isNaN(price) || price <= 0) {
        alert("Enter a valid price.");
        return;
      }
      const tx = await marketplace.updatePrice(id, parseEther(price));
      await tx.wait();
      alert(`Price updated!`);
      fetchMyNFTs();
      setPriceInputs({});
      setSelectedNFT((prevNFT) => ({
        ...prevNFT,
        price: parseEther(price).toString(),
        listed: true,
      }));
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("user rejected")) return;
      alert("Failed to update price");
    }
  };

  const unlistNFT = async (id) => {
    try {
      const tx = await marketplace.unlistNFT(id);
      await tx.wait();
      alert("NFT unlisted!");
      fetchMyNFTs();
      setPriceInputs({});
      setSelectedNFT((prevNFT) => ({
        ...prevNFT,
        price: parseEther("0").toString(),
        listed: false,
      }));
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("user rejected")) return;
      alert("Failed to unlist NFT");
    }
  };

  const handlePriceChange = (id, value) => {
    setPriceInputs({ ...priceInputs, [id]: value });
  };

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
    setPriceInputs({});
  };

  return (
    <div style={{ height: '100vh', flexDirection: 'column' }}>
      {/* Fixed Header */}
      <div style={{
  padding: '100px 0',
  textAlign: 'center',
  backgroundColor: 'transparent',
  boxShadow: '0 2px 20px #00f0ff22',
  color: '#fff',
}}>

        <h1 style={{ margin: '0 0 10px' }}>My NFTs</h1>
        <p style={{ color: '#aaa', margin: 0 }}>
          {walletAddress ? walletAddress : "Please connect your MetaMask wallet"}
        </p>
      </div>

      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
         // space for fixed header
        padding: '10px',
      }}>
        {myNFTs.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {myNFTs.map((nft, idx) => (
              <div
                key={idx}
                onClick={() => handleNFTClick(nft)}
                style={{
                  position: 'relative',
                  backgroundColor: '#282828',
                  borderRadius: '20px',
                  padding: '15px',
                  margin: '10px',
                  cursor: 'pointer',
                  width: '250px',
                  textAlign: 'center',
                  boxShadow: '0 0 14px #00f0ff55',
                  transition: 'transform 0.2s, box-shadow 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 0 14px #00f0ff99';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 14px #00f0ff55';
                }}
              >
                {nft.listed && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#00f0ff',
                    color: '#000',
                    fontWeight: 'bold',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 0 8px #00f0ff66',
                  }}>
                    Listed
                  </div>
                )}
                <img
                  src={nft.uri}
                  alt={`NFT-${nft.id}`}
                  style={{
                    width: '100%',
                    height: '250px',
                    borderRadius: '10px',
                    objectFit: 'contain',
                  }}
                />
                <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#f5f5f5' }}>NFT ID: {nft.id}</p>
                <p style={{ color: '#ccc' }}>Price: {parseFloat(nft.price) / 1e18} ETH</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>No NFTs found</p>
        )}
      </div>

      {/* Modal goes here (same as before)... */}
      {selectedNFT && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#333',
          padding: '20px',
          borderRadius: '15px',
          color: '#fff',
          width: '90%',
          maxWidth: '360px',
          boxShadow: '0 0 16px #00f0ff88',
          zIndex: 9999,
        }}>
          <h3 style={{ textAlign: 'center' }}>NFT Details</h3>
          <img
            src={selectedNFT.uri}
            alt={`NFT-${selectedNFT.id}`}
            style={{
              width: '100%',
              height: '220px',
              borderRadius: '10px',
              objectFit: 'contain',
            }}
          />
          <p style={{
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxHeight: '80px',
            overflowY: 'auto',
            fontSize: '0.85rem',
            marginTop: '10px',
            backgroundColor: '#222',
            padding: '8px',
            borderRadius: '8px',
          }}>
            <strong>URI:</strong> {selectedNFT.uri}
          </p>
          <p><strong>Price:</strong> {parseFloat(selectedNFT.price) / 1e18} ETH</p>

          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Enter price in ETH"
              value={priceInputs[selectedNFT.id] || ''}
              onChange={(e) => handlePriceChange(selectedNFT.id, e.target.value)}
              style={inputStyle}
            />
            {!selectedNFT.listed ? (
              <>
                <button onClick={() => listNFT(selectedNFT.id)} style={buttonStyle}>
                  List for Sale
                </button>
                <button onClick={() => deleteNFT(selectedNFT.id)} style={{ ...buttonStyle, marginLeft: '10px' }}>
                  Delete NFT
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
                <button onClick={() => updatePrice(selectedNFT.id)} style={actionButtonStyle}>
                  Update Price
                </button>
                <button onClick={() => unlistNFT(selectedNFT.id)} style={actionButtonStyle}>
                  Unlist
                </button>
              </div>
            )}
          </div>

          <button onClick={closeModal} style={closeButtonStyle}>Close</button>
        </div>
      )}
    </div>
  );
};

// === STYLES ===
const buttonStyle = {
  marginTop: '1rem',
  padding: '0.7rem 1.6rem',
  fontSize: '1rem',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '1px solid #ccc',
  color: '#fff',
  fontWeight: 'bold',
  transition: 'all 0.3s ease-in-out',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #aaa',
  backgroundColor: 'transparent',
  color: '#fff',
  width: '100%',
  maxWidth: '240px',
  margin: '10px auto',
  display: 'block',
};

const closeButtonStyle = {
  marginTop: '1rem',
  padding: '0.7rem 1.6rem',
  fontSize: '1rem',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  borderRadius: '10px',
  border: 'none',
  color: '#00f0ff',
  fontWeight: 'bold',
  transition: 'all 0.3s ease-in-out',
};

const actionButtonStyle = {
  ...buttonStyle,
  width: '120px',
  marginTop: 0,
};

export default MyNfts;
