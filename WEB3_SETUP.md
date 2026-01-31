# Web3 Setup and Deployment Guide

You have successfully transitioned the application to support Web3 storage on the Sepolia testnet!

## 1. Prerequisites
- **MetaMask** installed in your browser.
- **Sepolia ETH** in your wallet (get from a faucet like `sepoliafaucet.com`).

## 2. Deploy Script
Since we don't have a full Hardhat setup in this project yet, the easiest way to deploy is via **Remix IDE**:

1. Open [Remix IDE](https://remix.ethereum.org/).
2. Create a new file `TranscriptionStorage.sol`.
3. Copy the content from `contracts/TranscriptionStorage.sol` in your workspace.
4. Compile the contract (Ctrl+S or use the compiler tab).
5. Go to the "Deploy & Run Transactions" tab.
6. Select **Injected Provider - MetaMask** as the Environment.
7. Click **Deploy**.
8. Confirm the transaction in MetaMask.
9. **Copy the deployed contract address**.

## 3. Update Frontend
1. Open `frontend/src/pages/Transcribe.js`.
2. Locate the line:
   ```javascript
   const CONTRACT_ADDRESS = "0xYourContractAddressHere";
   ```
3. Replace `"0xYourContractAddressHere"` with your actual deployed contract address.

## 4. Testing
1. Run the backend:
   ```bash
   cd stt_tts_service
   python app.py
   ```
2. Run the frontend:
   ```bash
   cd frontend
   npm start
   ```
3. Connect your wallet using the Navbar button.
4. Upload an audio file and transcribe it.
5. Click **"Save to Blockchain"**.
6. Confirm the transaction in MetaMask.
7. Wait for the confirmation alert.

## Troubleshooting
- **Insufficient Funds**: Ensure you have enough Sepolia ETH for gas.
- **Wrong Network**: Ensure MetaMask is set to Sepolia.
- **Contract Error**: Ensure the ABI in `Transcribe.js` matches the deployed contract (it is currently hardcoded to match).
