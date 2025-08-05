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

## Troubleshooting

### Campaign Creation Issues

If you get "Failed to create campaign" errors:

1. **Check form validation**: 
   - Title: 1-100 characters
   - Description: 50-1000 characters  
   - Story: 100+ characters (recommended)
   - Goal: 0.01-1000 ETH
   - Duration: 1-365 days

2. **Restart blockchain and redeploy**:
   ```bash
   # Stop current blockchain (Ctrl+C)
   cd contracts
   npx hardhat node --hostname 0.0.0.0
   
   # In new terminal
   cd contracts  
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Check browser console** for detailed error messages

4. **Verify MetaMask connection** and sufficient ETH balance

## Money Flow & Campaign Lifecycle

### 💰 How Money Flows in the Platform

#### **1. When You Support a Campaign (Contribute)**
- Your ETH goes directly into the **smart contract as escrow**
- Money is **NOT** sent to the creator immediately
- The contract tracks your contribution amount
- Multiple safety checks prevent overfunding (max 150% of goal)

#### **2. Campaign States & Outcomes**

**🎯 Scenario 1: Campaign Reaches Goal (Your Example)**
```
✅ Campaign created: 30-day deadline, 2 ETH goal
✅ Day 7: Goal reached (2+ ETH raised)
✅ Creator can withdraw funds immediately (doesn't need to wait 30 days)
```

**❌ Scenario 2: Campaign Fails (Goal Not Reached)**
```
❌ Day 30: Deadline reached, only 1.5 ETH raised (goal was 2 ETH)
🔄 All contributors can claim full refunds
💸 Creator gets nothing
```

#### **3. Creator Cashout Process**

**Requirements to Withdraw:**
- ✅ Goal must be reached (`goalReached = true`)
- ✅ Only campaign creator can withdraw
- ✅ Can only withdraw once

**Money Distribution:**
- **Platform Fee**: 2.5% goes to fee collector
- **Creator Gets**: 97.5% of total raised amount

**Example:**
```
Total Raised: 2.5 ETH
Platform Fee: 0.0625 ETH (2.5%)
Creator Gets: 2.4375 ETH (97.5%)
```

#### **4. Key Security Features**

**🔒 Escrow Protection:**
- Funds locked in smart contract until goal reached
- No single party can access funds inappropriately
- Automatic refunds if campaign fails

**🛡️ Safety Mechanisms:**
- Creators cannot contribute to their own campaigns
- Contribution limit: Maximum 150% of goal
- Reentrancy protection against hacks
- Emergency pause functionality

**💸 Refund Process:**
- Available only AFTER deadline passes
- Only if goal was NOT reached
- Contributors get 100% of their money back
- Each person claims their own refund

#### **5. Timeline Example**

```
Day 0:  Campaign created (Goal: 2 ETH, 30 days)
Day 1-6: Contributors send ETH → Contract holds it
Day 7:  Goal reached! (2+ ETH in contract)
Day 7+: Creator can call withdrawFunds() anytime
        → Creator gets 97.5%, Platform gets 2.5%
        → Campaign marked as completed

Alternative Timeline (Failure):
Day 30: Deadline reached, only 1.8 ETH raised
Day 30+: Contributors can call claimRefund()
         → Each gets 100% of their contribution back
```

### 🔧 Smart Contract Functions

- **`contribute()`**: Send ETH to campaign (goes to escrow)
- **`withdrawFunds()`**: Creator cashes out (only if goal reached)
- **`claimRefund()`**: Get money back (only if campaign failed)
- **`cancelCampaign()`**: Creator cancels (only if no contributions yet)

This ensures **maximum security** for both creators and contributors! 🚀
