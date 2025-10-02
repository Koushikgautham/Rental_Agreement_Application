# Smart Contract Deployment Guide

## RentalEscrow Smart Contract

This Solidity smart contract manages security deposit escrow for rental agreements with the following features:

### Key Features
- **Secure Escrow**: Holds security deposits safely on blockchain
- **Automatic Release**: Auto-releases deposit to tenant after agreement end date
- **Dispute Resolution**: Built-in dispute mechanism with resolver role
- **Multi-party Control**: Both landlord and tenant can interact with escrow
- **Emergency Safeguards**: Protection against fund loss with emergency functions

### Contract Functions

#### Core Functions
1. **createEscrow()** - Create new escrow with deposit
2. **releaseToTenant()** - Release deposit to tenant (landlord or auto)
3. **releaseToLandlord()** - Release deposit to landlord (with reason)
4. **raiseDispute()** - Raise dispute on escrow
5. **resolveDispute()** - Resolve dispute (dispute resolver only)

#### View Functions
1. **getEscrow()** - Get escrow details
2. **getLandlordEscrows()** - Get landlord's escrow IDs
3. **getTenantEscrows()** - Get tenant's escrow IDs
4. **isAutoReleaseDue()** - Check if auto-release is due

## Deployment Instructions

### Prerequisites
```bash
npm install -g @remix-project/remixd
npm install hardhat
npm install @openzeppelin/contracts
```

### Using Remix IDE (Recommended for beginners)

1. **Open Remix IDE**: Go to https://remix.ethereum.org
2. **Create New File**: Create `RentalEscrow.sol` in contracts folder
3. **Copy Contract Code**: Paste the Solidity code
4. **Compile Contract**:
   - Select Solidity compiler version 0.8.19+
   - Click "Compile RentalEscrow.sol"
5. **Deploy Contract**:
   - Go to "Deploy & Run Transactions" tab
   - Select "Injected Web3" for MetaMask
   - Set constructor parameter (dispute resolver address)
   - Click "Deploy"

### Using Hardhat (For advanced users)

1. **Setup Hardhat Project**:
```bash
mkdir rental-escrow-contract
cd rental-escrow-contract
npm init -y
npm install --save-dev hardhat
npx hardhat
```

2. **Create Deployment Script** (`scripts/deploy.js`):
```javascript
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy contract
  const RentalEscrow = await ethers.getContractFactory("RentalEscrow");
  const disputeResolver = "0x..."; // Set dispute resolver address
  const rentalEscrow = await RentalEscrow.deploy(disputeResolver);

  console.log("RentalEscrow deployed to:", rentalEscrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

3. **Configure Network** (`hardhat.config.js`):
```javascript
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    polygon: {
      url: process.env.POLYGON_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

4. **Deploy to Network**:
```bash
npx hardhat run scripts/deploy.js --network mumbai  # Testnet
npx hardhat run scripts/deploy.js --network polygon # Mainnet
```

### Network Configuration

#### Polygon Mumbai Testnet (Recommended for testing)
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Chain ID**: 80001
- **Currency**: MATIC
- **Block Explorer**: https://mumbai.polygonscan.com

#### Polygon Mainnet
- **RPC URL**: https://polygon-rpc.com
- **Chain ID**: 137
- **Currency**: MATIC
- **Block Explorer**: https://polygonscan.com

### Gas Optimization Tips

1. **Batch Operations**: Group multiple operations when possible
2. **Storage vs Memory**: Use memory for temporary data
3. **Modifier Usage**: Combine common checks in modifiers
4. **Event Logging**: Use events instead of storing non-critical data

### Security Considerations

1. **Reentrancy Protection**: Contract uses transfer() to prevent reentrancy
2. **Access Control**: Role-based permissions for different functions
3. **Input Validation**: Comprehensive input validation on all functions
4. **Emergency Functions**: Emergency withdrawal for extreme cases
5. **Dispute Resolution**: Built-in mechanism to handle conflicts

### Testing the Contract

Create test cases for:
- ✅ Escrow creation with valid parameters
- ✅ Deposit release to tenant (manual and automatic)
- ✅ Deposit release to landlord with valid reason
- ✅ Dispute raising and resolution
- ✅ Emergency scenarios and edge cases
- ✅ Access control validation
- ✅ Gas usage optimization

### Integration with Backend

Update your `.env` file with deployed contract details:
```env
CONTRACT_ADDRESS=0x...  # Deployed contract address
POLYGON_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=0x...  # Your private key (keep secure!)
```

The backend `BlockchainService.js` is already configured to work with this contract.

### Cost Estimation

#### Deployment Cost (Polygon):
- Contract deployment: ~0.1-0.2 MATIC
- Each escrow creation: ~0.01-0.02 MATIC
- Release transactions: ~0.005-0.01 MATIC

#### Monthly Operational Cost:
- For 100 escrows/month: ~1-2 MATIC
- For 1000 escrows/month: ~10-20 MATIC

### Support and Maintenance

1. **Contract Upgrades**: Use proxy patterns for upgradeable contracts
2. **Monitoring**: Set up event monitoring for escrow activities
3. **Backup**: Keep multiple copies of contract ABI and bytecode
4. **Documentation**: Maintain updated documentation for all functions

For questions or support, refer to:
- Polygon Documentation: https://docs.polygon.technology
- Hardhat Documentation: https://hardhat.org/docs
- Remix IDE Guide: https://remix-ide.readthedocs.io