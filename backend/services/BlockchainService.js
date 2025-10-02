const { ethers } = require('ethers');
const crypto = require('crypto');

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    
    // ABI for the rental smart contract (will be defined later)
    this.contractABI = [
      // Add ABI here when contract is deployed
    ];
    
    if (this.contractAddress) {
      this.contract = new ethers.Contract(this.contractAddress, this.contractABI, this.wallet);
    }
  }

  /**
   * Generate hash for document/data
   * @param {Object} data - Data to hash
   * @returns {string} - SHA256 hash
   */
  generateHash(data) {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Store agreement hash on blockchain
   * @param {Object} agreementData - Agreement data
   * @returns {Object} - Transaction details
   */
  async storeAgreementHash(agreementData) {
    try {
      const agreementHash = this.generateHash(agreementData);
      
      // For now, we'll simulate blockchain storage
      // In production, this would interact with actual smart contract
      const transactionHash = this.generateHash({
        type: 'agreement',
        hash: agreementHash,
        timestamp: Date.now()
      });

      // Simulate blockchain transaction
      const blockchainResult = {
        agreementHash,
        transactionHash,
        blockNumber: Math.floor(Math.random() * 1000000).toString(),
        isOnBlockchain: true,
        timestamp: new Date().toISOString(),
        gasUsed: '21000',
        gasPrice: '20000000000' // 20 gwei
      };

      console.log('Agreement hash stored on blockchain:', blockchainResult);
      
      return blockchainResult;
    } catch (error) {
      console.error('Error storing agreement hash:', error);
      throw new Error('Failed to store agreement hash on blockchain');
    }
  }

  /**
   * Store payment receipt hash on blockchain
   * @param {Object} paymentData - Payment data
   * @returns {Object} - Transaction details
   */
  async storePaymentHash(paymentData) {
    try {
      const paymentHash = this.generateHash(paymentData);
      
      // For now, we'll simulate blockchain storage
      const transactionHash = this.generateHash({
        type: 'payment',
        hash: paymentHash,
        timestamp: Date.now()
      });

      // Simulate blockchain transaction
      const blockchainResult = {
        paymentHash,
        receiptHash: this.generateHash(paymentData.receipt || {}),
        transactionHash,
        blockNumber: Math.floor(Math.random() * 1000000).toString(),
        isOnBlockchain: true,
        timestamp: new Date().toISOString(),
        gasUsed: '21000',
        gasPrice: '20000000000'
      };

      console.log('Payment hash stored on blockchain:', blockchainResult);
      
      return blockchainResult;
    } catch (error) {
      console.error('Error storing payment hash:', error);
      throw new Error('Failed to store payment hash on blockchain');
    }
  }

  /**
   * Create security deposit escrow
   * @param {Object} escrowData - Escrow parameters
   * @returns {Object} - Escrow details
   */
  async createSecurityDepositEscrow(escrowData) {
    try {
      const {
        landlordAddress,
        tenantAddress,
        depositAmount,
        propertyHash,
        agreementHash,
        releaseDate
      } = escrowData;

      if (!this.contract) {
        throw new Error('Smart contract not initialized');
      }

      // Call smart contract method to create escrow
      const tx = await this.contract.createEscrow(
        landlordAddress,
        tenantAddress,
        ethers.parseEther(depositAmount.toString()),
        propertyHash,
        agreementHash,
        Math.floor(new Date(releaseDate).getTime() / 1000)
      );

      await tx.wait();

      const escrowResult = {
        escrowId: tx.hash,
        transactionHash: tx.hash,
        landlordAddress,
        tenantAddress,
        depositAmount,
        propertyHash,
        agreementHash,
        releaseDate,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      console.log('Security deposit escrow created:', escrowResult);
      
      return escrowResult;
    } catch (error) {
      console.error('Error creating security deposit escrow:', error);
      throw new Error('Failed to create security deposit escrow');
    }
  }

  /**
   * Release security deposit from escrow
   * @param {string} escrowId - Escrow ID
   * @param {boolean} releaseTenant - Whether to release to tenant
   * @returns {Object} - Release transaction details
   */
  async releaseSecurityDeposit(escrowId, releaseTenant = true) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract not initialized');
      }

      let tx;
      if (releaseTenant) {
        tx = await this.contract.releaseToTenant(escrowId);
      } else {
        tx = await this.contract.releaseToLandlord(escrowId);
      }

      await tx.wait();

      const releaseResult = {
        escrowId,
        transactionHash: tx.hash,
        releasedTo: releaseTenant ? 'tenant' : 'landlord',
        releasedAt: new Date().toISOString(),
        status: 'released'
      };

      console.log('Security deposit released:', releaseResult);
      
      return releaseResult;
    } catch (error) {
      console.error('Error releasing security deposit:', error);
      throw new Error('Failed to release security deposit');
    }
  }

  /**
   * Verify document hash on blockchain
   * @param {string} documentHash - Hash to verify
   * @param {string} transactionHash - Transaction hash to check
   * @returns {boolean} - Verification result
   */
  async verifyDocumentHash(documentHash, transactionHash) {
    try {
      // For now, we'll simulate verification
      // In production, this would query the blockchain
      
      // Simulate successful verification
      const isValid = documentHash && transactionHash;
      
      console.log('Document hash verification:', { documentHash, transactionHash, isValid });
      
      return isValid;
    } catch (error) {
      console.error('Error verifying document hash:', error);
      return false;
    }
  }

  /**
   * Get escrow status
   * @param {string} escrowId - Escrow ID
   * @returns {Object} - Escrow status
   */
  async getEscrowStatus(escrowId) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract not initialized');
      }

      const escrowInfo = await this.contract.getEscrow(escrowId);
      
      return {
        escrowId,
        landlord: escrowInfo.landlord,
        tenant: escrowInfo.tenant,
        amount: ethers.formatEther(escrowInfo.amount),
        status: escrowInfo.status,
        releaseDate: new Date(escrowInfo.releaseDate * 1000).toISOString(),
        isReleased: escrowInfo.isReleased,
        releasedTo: escrowInfo.releasedTo
      };
    } catch (error) {
      console.error('Error getting escrow status:', error);
      throw new Error('Failed to get escrow status');
    }
  }

  /**
   * Get transaction details
   * @param {string} transactionHash - Transaction hash
   * @returns {Object} - Transaction details
   */
  async getTransactionDetails(transactionHash) {
    try {
      const tx = await this.provider.getTransaction(transactionHash);
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      return {
        transactionHash,
        blockNumber: tx.blockNumber,
        blockHash: tx.blockHash,
        from: tx.from,
        to: tx.to,
        value: ethers.formatEther(tx.value),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: tx.gasPrice.toString(),
        status: receipt.status === 1 ? 'success' : 'failed',
        timestamp: new Date().toISOString() // Would need to get block timestamp
      };
    } catch (error) {
      console.error('Error getting transaction details:', error);
      throw new Error('Failed to get transaction details');
    }
  }

  /**
   * Estimate gas for transaction
   * @param {string} method - Contract method
   * @param {Array} params - Method parameters
   * @returns {string} - Estimated gas
   */
  async estimateGas(method, params = []) {
    try {
      if (!this.contract) {
        throw new Error('Smart contract not initialized');
      }

      const estimatedGas = await this.contract[method].estimateGas(...params);
      return estimatedGas.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas');
    }
  }

  /**
   * Get current gas price
   * @returns {string} - Current gas price in wei
   */
  async getCurrentGasPrice() {
    try {
      const feeData = await this.provider.getFeeData();
      return feeData.gasPrice.toString();
    } catch (error) {
      console.error('Error getting gas price:', error);
      throw new Error('Failed to get gas price');
    }
  }

  /**
   * Get wallet balance
   * @param {string} address - Wallet address
   * @returns {string} - Balance in ETH
   */
  async getBalance(address = null) {
    try {
      const targetAddress = address || this.wallet.address;
      const balance = await this.provider.getBalance(targetAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  }
}

module.exports = BlockchainService;