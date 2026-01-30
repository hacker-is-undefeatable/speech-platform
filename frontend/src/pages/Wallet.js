import React, { useState, useEffect } from 'react';
import './Wallet.css';

function Wallet() {
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState('');

  useEffect(() => {
    // 1. Get stored wallet address
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
      fetchBalance(storedAddress);
    } else {
        // Double check standard connection if not in local storage
        checkConnection();
    }

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            fetchBalance(accounts[0]);
        }
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletAddress('');
      localStorage.removeItem('walletAddress');
    } else {
      setWalletAddress(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
      fetchBalance(accounts[0]);
    }
  };

  const fetchBalance = async (address) => {
    if (window.ethereum && address) {
      try {
        // Get Balance
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        
        // Convert from Wei to Ether (Hex to Decimal / 10^18)
        const balanceWei = BigInt(balanceHex);
        // Simple conversion roughly to 4 decimal places
        const balanceEth = Number(balanceWei) / 1e18; 
        setBalance(balanceEth.toFixed(4));

        // Get Chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainIdHex);

      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const isSepolia = chainId === '0xaa36a7'; // Sepolia Chain ID in Hex

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="wallet-header">
          <h1>My Wallet</h1>
          {chainId && (
            <span className={`network-badge ${isSepolia ? 'sepolia' : 'unknown'}`}>
              {isSepolia ? 'Sepolia Testnet' : `Network ID: ${chainId} (Please switch to Sepolia)`}
            </span>
          )}
        </div>

        {walletAddress ? (
          <div className="wallet-details">
            <div className="detail-item">
              <span className="detail-label">Wallet Address</span>
              <span className="detail-value">{walletAddress}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Balance</span>
              <span className="detail-value highlight">{balance} ETH</span>
            </div>
            
            {!isSepolia && (
                <div style={{color:'orange', fontSize: '0.9rem'}}>
                    Your wallet is not connected to the Sepolia testnet. Values may be incorrect.
                </div>
            )}
          </div>
        ) : (
          <div className="wallet-details">
            <p>No wallet connected. Please connect via the Navigation Bar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wallet;
