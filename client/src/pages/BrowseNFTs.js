import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFTMarketPlaceABI from '../NFTMarketPlace.json';
import { useWallet } from './walletContext';

const BrowseNFTs = () => {
  const { walletAddress } = useWallet();
  const [listedNFTs, setListedNFTs] = useState([]);
  const [filteredNFTs, setFilteredNFTs] = useState([]);
  const [maxPrice, setMaxPrice] = useState('');
  const [marketplace, setMarketplace] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [hoveredCardId, setHoveredCardId] = useState(null); // 👈 added this
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    const setup = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketPlaceABI.abi, signer);
      setMarketplace(contract);

      const listed = await contract.getListedNFTs();

      let formatted = listed.map((nft) => ({
        id: nft.id.toString(),
        uri: nft.uri,
        price: ethers.formatEther(nft.price),
        seller: nft.seller.toLowerCase(),
      }));

      if (walletAddress) {
        formatted = formatted.filter(nft => nft.seller !== walletAddress.toLowerCase());
      }

      setListedNFTs(formatted);
      setFilteredNFTs(formatted);
    };

    setup();
  }, [CONTRACT_ADDRESS, walletAddress]);

  const handleFilter = () => {
    if (!maxPrice) return;
    if (maxPrice < 0) {
      alert('Maximum Price must be positive');
      return;
    }
    const filtered = listedNFTs.filter(nft => parseFloat(nft.price) <= parseFloat(maxPrice));
    setFilteredNFTs(filtered);
  };

  const buyNFT = async (id, price) => {
    try {
      if (!walletAddress) {
        alert('Please Login to Buy');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = (await signer.getAddress()).toLowerCase();
      const balance = await provider.getBalance(userAddress);
      const balanceInEth = parseFloat(ethers.formatEther(balance));

      const selected = listedNFTs.find(nft => nft.id === id);

      if (selected.seller === userAddress) {
        alert("You cannot buy your own NFT");
        return;
      }

      if (balanceInEth < parseFloat(price)) {
        alert(`Insufficient ETH balance. You need at least ${price} ETH.`);
        return;
      }

      const tx = await marketplace.buyNFT(id, {
        value: ethers.parseEther(price),
      });

      await tx.wait();
      alert(`NFT ${id} purchased!`);

      const listed = await marketplace.getListedNFTs();
      const formatted = listed.map((nft) => ({
        id: nft.id.toString(),
        uri: nft.uri,
        price: ethers.formatEther(nft.price),
        seller: nft.seller.toLowerCase(),
      })).filter(nft => nft.seller !== walletAddress.toLowerCase());

      setListedNFTs(formatted);
      setFilteredNFTs(formatted);
      setSelectedNFT(null);
    } catch (err) {
      console.error(err);
      if (err.code === 4001 || err.message.includes("user rejected")) {
        console.log("Transaction cancelled by user.");
      } else {
        alert("Purchase failed");
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.filterBarContainer}>
        <input
          type="number"
          placeholder="Max price (ETH)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleFilter} style={styles.filterButton}>
          Filter
        </button>
      </div>

      <div style={styles.nftGrid}>
        {filteredNFTs && filteredNFTs.length > 0 ? (
          filteredNFTs.map((nft) => (
            <div
              key={nft.id}
              onClick={() => setSelectedNFT(nft)}
              onMouseEnter={() => setHoveredCardId(nft.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              style={{
                ...styles.nftCard,
                ...(hoveredCardId === nft.id ? styles.nftCardHover : {})
              }}
            >
              <div style={styles.imageWrapper}>
                <img
                  src={nft.uri}
                  alt={`NFT ${nft.id}`}
                  style={styles.nftImage}
                  onError={(e) =>
                    (e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found')
                  }
                />
              </div>
              <div style={styles.nftPrice}>
                <p>{nft.price} ETH</p>
              </div>
            </div>
          ))
        ) : (
          <p>No Listed NFTs found</p>
        )}
      </div>

      {selectedNFT && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <span style={styles.closeButton} onClick={() => setSelectedNFT(null)}>&times;</span>
            <img
              src={selectedNFT.uri}
              style={styles.modalImage}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found')}
              alt="Selected NFT"
            />
            <div style={styles.modalDetails}>
              <p><strong>ID:</strong> {selectedNFT.id}</p>
              <p style={styles.uriText}><strong>URI:</strong> {selectedNFT.uri}</p>
              <p><strong>Price:</strong> {selectedNFT.price} ETH</p>
              <button
                style={styles.buyButton}
                onClick={() => buyNFT(selectedNFT.id, selectedNFT.price)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '100px',
    paddingLeft: '20px',
    paddingRight: '20px',
    boxSizing: 'border-box',
    minHeight: '100vh',
    zIndex:1,
  },
  filterBarContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '600px',
    gap: '10px',
    marginBottom: '30px',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  input: {
    backgroundColor: 'transparent',
    border: '2px solid #00fff7',
    color: '#00fff7',
    padding: '12px',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '16px',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
    width: '300px',   // 👈 set desired width here
  height: '15px', 
  },
  filterButton: {
    backgroundColor: '#00fff7',
    border: 'none',
    color: '#121212',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 10px #00fff7, 0 0 20px #00fff7',
    zIndex: 20,
  },
  nftGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  },
  nftCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    padding: '15px',
    width: '240px',
    cursor: 'pointer',
    boxShadow: '0 0 14px #00f0ff55',
    textAlign: 'center',
    transition: 'box-shadow 0.3s ease',
  },
  nftCardHover: {
    boxShadow: '0 0 16px #00f0ff',
  },
  nftImage: {
    width: '100%',
    height: '220px',
    objectFit: 'contain',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  nftPrice: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: '20px',
    padding: '20px',
    color: '#fff',
    textAlign: 'center',
    width: '320px',
    boxShadow: '0 0 16px #00f0ff88',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '24px',
    cursor: 'pointer',
  },
  modalImage: {
    width: '100%',
    height: '300px',
    objectFit: 'contain',
    marginBottom: '20px',
  },
  modalDetails: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  uriText: {
    wordBreak: 'break-all',
  },
  buyButton: {
    marginTop: '1rem',
    padding: '0.7rem 1.6rem',
    fontSize: '1rem',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '10px',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 12px #00f0ff, 0 0 20px #00f0ff',
  },
};

export default BrowseNFTs;
