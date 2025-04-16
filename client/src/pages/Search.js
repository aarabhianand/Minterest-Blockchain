import React, { useState, useEffect } from 'react';
import { ethers, formatEther } from 'ethers';
import NFTMarketPlaceABI from '../NFTMarketPlace.json';
import { useWallet } from './walletContext'; 

const NftUriSearch = () => {
  const [uriInput, setUriInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [marketplace, setMarketplace] = useState(null);

  const { walletAddress, connectWallet } = useWallet();
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

  useEffect(() => {
    const setup = async () => {
      if (!walletAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketPlaceABI.abi, signer);
      setMarketplace(contract);
    };

    setup();
  }, [CONTRACT_ADDRESS,walletAddress]);

  const handleSearch = async () => {
    if (!walletAddress) {
      alert('Please connect your wallet first.');
      return connectWallet();
    }

    setLoading(true);
    setResult(null);
    setError('');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMarketPlaceABI.abi, provider);

      const total = await contract.totalSupply();
      const totalSupply = Number(total);
      let found = false;

      for (let i = 1; i <= totalSupply; i++) {
        const nft = await contract.nfts(i);
        if (nft.uri === uriInput) {
          found = true;
          setResult({
            id: nft.id.toString(),
            owner: nft.owner,
            listed: nft.listed,
            price: formatEther(nft.price.toString()),
          });
          break;
        }
      }

      if (!found) {
        setError('NFT with this URI not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Error occurred while searching.');
    }

    setLoading(false);
  };


  const buyNFT = async (id, price) => {
        try {
            if(!walletAddress){
                alert('Please Login to Buy')
                return
              }
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = (await signer.getAddress()).toLowerCase();
          const balance = await provider.getBalance(userAddress);
          const balanceInEth = parseFloat(ethers.formatEther(balance));
          console.log(userAddress)
      
          // Check if NFT is owned by user
          if (result.owner.toLowerCase() === userAddress) {
            alert("You cannot buy your own NFT.");
            return;
          }
      
          // Check if user has enough ETH
          if (balanceInEth < parseFloat(price)) {
            alert(`Insufficient ETH balance. You need at least ${price} ETH.`);
            return;
          }
      
          // Send transaction
          const tx = await marketplace.buyNFT(id, {
            value: ethers.parseEther(price),
          });
      
          await tx.wait();
          alert(`NFT ${id} purchased!`);
          await handleSearch()

        } catch (err) {
          console.error(err);
          if (err.code === 4001 || err.message.includes("user rejected")) {
            console.log("Transaction cancelled by user.");
          } else {
            console.error(err);
            alert("Purchase failed");
          }
        }

      };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        
        <input
          type="text"
          placeholder="Enter NFT image URI"
          value={uriInput}
          onChange={(e) => setUriInput(e.target.value)}
          style={styles.input}
        />
        
        <button onClick={handleSearch} disabled={loading} style={styles.searchButton}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <img src={uriInput} alt={`NFT ID: ${result.id}`} style={styles.nftimage}/>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Owner:</strong> {result.owner}</p>
          <p><strong>Status:</strong> {result.listed ? 'Listed for Sale' : 'Owned (Not listed)'}</p>

          {result.listed && walletAddress && result.owner.toLowerCase()!==walletAddress.toLowerCase() && (
            <>
              <p><strong>Price:</strong> {result.price} ETH</p>
              <button onClick={() => buyNFT(result.id, result.price)} style={styles.buyButton}>
                Buy Now
              </button>
            </>
          )}
        </div>
      )}

      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'transparent',
    color: '#ffffff',
    paddingTop: '100px',
    paddingLeft: '20px',
    paddingRight: '20px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
  },
  nftimage: {
    height: '220px',
    objectFit: 'cover',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  searchContainer: {
    display: 'flex',
    width: '100%',
    maxWidth: '600px',
    gap: '10px',
    marginBottom: '30px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '2px solid #00fff7',
    color: '#00fff7',
    padding: '12px',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '16px',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
  },
  searchButton: {
    backgroundColor: '#00fff7',
    border: 'none',
    color: '#121212',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 0 10px #00fff7, 0 0 20px #00fff7',
  },
  resultBox: {
    marginTop: '30px',
    backgroundColor: '#2a2a2a',
    border: '2px solid #00fff7',
    padding: '20px',
    borderRadius: '8px',
    color: '#ffffff',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 0 15px rgba(0, 123, 255, 0.3)',
  },
  buyButton: {
    marginTop: '15px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    transition: '0.3s ease-in-out',
    boxShadow: '0 0 10px #00fff7, 0 0 20px #00fff7',
  },
  errorText: {
    color: '#ff4d4d',
    marginTop: '20px',
    textAlign: 'center',
  },
};

export default NftUriSearch;
