# BlockLift - Decentralized Crowdfunding Platform

A blockchain-based crowdfunding platform built with Next.js, Hardhat, and Ethereum.

## Prerequisites

- Node.js (v18+)
- pnpm
- MetaMask browser extension

## Quick Setup

### 1. Install Dependencies
```bash
# Install frontend dependencies
pnpm install

# Install contract dependencies
cd contracts
pnpm install
cd ..
```

### 2. Start Blockchain (Terminal 1)
```bash
cd contracts
npx hardhat node --hostname 0.0.0.0
```
Keep this terminal running. The blockchain will be available at `http://localhost:8545`

### 3. Deploy Smart Contract (Terminal 2)
```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Create Sample Campaigns (Terminal 2)
```bash
# From project root
node sample-campaigns.cjs
```

### 5. Start Web Server (Terminal 3)
```bash
# From project root
pnpm run dev
```

## Access URLs

- **Web App:** http://localhost:3000
- **Network Access:** http://172.17.212.140:3000
- **Blockchain RPC:** http://localhost:8545

## MetaMask Setup

Add this network to MetaMask:
- **Network Name:** Hardhat Local
- **RPC URL:** http://localhost:8545
- **Chain ID:** 31337
- **Currency:** ETH

## Test Accounts (10,000 ETH each)

```
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
```

Import any of these accounts into MetaMask using the private keys from the Hardhat node output.

## Features

- ✅ View campaigns without wallet connection
- ✅ Filter campaigns by category
- ✅ Connect wallet to contribute
- ✅ Create new campaigns
- ✅ Multi-device network access
- ✅ Real-time blockchain data

## Project Structure

```
├── contracts/          # Smart contracts and Hardhat config
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   ├── lib/            # Utilities and blockchain services
│   └── styles/         # CSS styles
├── public/             # Static assets
└── sample-campaigns.cjs # Script to create test campaigns
```

## Stopping Servers

Press `Ctrl+C` in each terminal to stop the servers.
