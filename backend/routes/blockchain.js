const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const BlockchainService = require('../services/BlockchainService');
const Agreement = require('../models/Agreement');
const Payment = require('../models/Payment');

const router = express.Router();

// Initialize blockchain service
const blockchainService = new BlockchainService();

// @desc    Store agreement hash on blockchain
// @route   POST /api/blockchain/agreement
// @access  Private (Landlord only)
router.post('/agreement', protect, authorize('landlord'), [
  body('agreementId').isMongoId().withMessage('Valid agreement ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { agreementId } = req.body;
    const landlordId = req.user.id;

    // Find and verify agreement
    const agreement = await Agreement.findOne({
      _id: agreementId,
      landlord: landlordId
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    // Check if already on blockchain
    if (agreement.blockchain.isOnBlockchain) {
      return res.status(400).json({
        success: false,
        message: 'Agreement already stored on blockchain'
      });
    }

    // Prepare agreement data for hashing
    const agreementData = {
      agreementNumber: agreement.agreementNumber,
      property: agreement.property,
      landlord: agreement.landlord,
      tenant: agreement.tenant,
      terms: agreement.terms,
      clauses: agreement.clauses,
      signatures: agreement.signatures,
      createdAt: agreement.createdAt
    };

    // Store on blockchain
    const blockchainResult = await blockchainService.storeAgreementHash(agreementData);

    // Update agreement with blockchain data
    agreement.blockchain = {
      agreementHash: blockchainResult.agreementHash,
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      isOnBlockchain: true
    };

    await agreement.save();

    res.json({
      success: true,
      message: 'Agreement hash stored on blockchain successfully',
      data: {
        agreementId,
        blockchainData: agreement.blockchain,
        gasUsed: blockchainResult.gasUsed,
        gasPrice: blockchainResult.gasPrice
      }
    });

  } catch (error) {
    console.error('Store agreement on blockchain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store agreement on blockchain'
    });
  }
});

// @desc    Store payment hash on blockchain
// @route   POST /api/blockchain/payment
// @access  Private
router.post('/payment', protect, [
  body('paymentId').isMongoId().withMessage('Valid payment ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { paymentId } = req.body;
    const userId = req.user.id;

    // Build query based on user role
    const query = { _id: paymentId, status: 'completed' };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const payment = await Payment.findOne(query);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Completed payment not found'
      });
    }

    // Check if already on blockchain
    if (payment.blockchain.isOnBlockchain) {
      return res.status(400).json({
        success: false,
        message: 'Payment already stored on blockchain'
      });
    }

    // Prepare payment data for hashing
    const paymentData = {
      paymentId: payment.paymentId,
      property: payment.property,
      landlord: payment.landlord,
      tenant: payment.tenant,
      amount: payment.amount,
      type: payment.type,
      period: payment.period,
      paidDate: payment.paidDate,
      receipt: {
        receiptNumber: payment.receipt.receiptNumber,
        generatedAt: payment.receipt.generatedAt
      }
    };

    // Store on blockchain
    const blockchainResult = await blockchainService.storePaymentHash(paymentData);

    // Update payment with blockchain data
    payment.blockchain = {
      paymentHash: blockchainResult.paymentHash,
      receiptHash: blockchainResult.receiptHash,
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      isOnBlockchain: true
    };

    await payment.save();

    res.json({
      success: true,
      message: 'Payment hash stored on blockchain successfully',
      data: {
        paymentId,
        blockchainData: payment.blockchain,
        gasUsed: blockchainResult.gasUsed,
        gasPrice: blockchainResult.gasPrice
      }
    });

  } catch (error) {
    console.error('Store payment on blockchain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store payment on blockchain'
    });
  }
});

// @desc    Create security deposit escrow
// @route   POST /api/blockchain/escrow
// @access  Private (Landlord only)
router.post('/escrow', protect, authorize('landlord'), [
  body('agreementId').isMongoId().withMessage('Valid agreement ID is required'),
  body('tenantWalletAddress').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Valid tenant wallet address is required'),
  body('landlordWalletAddress').matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Valid landlord wallet address is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      agreementId,
      tenantWalletAddress,
      landlordWalletAddress
    } = req.body;
    const landlordId = req.user.id;

    // Find and verify agreement
    const agreement = await Agreement.findOne({
      _id: agreementId,
      landlord: landlordId,
      status: 'active'
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Active agreement not found'
      });
    }

    // Prepare escrow data
    const escrowData = {
      landlordAddress: landlordWalletAddress,
      tenantAddress: tenantWalletAddress,
      depositAmount: agreement.terms.securityDeposit,
      propertyHash: blockchainService.generateHash(agreement.property.toString()),
      agreementHash: agreement.blockchain.agreementHash || blockchainService.generateHash(agreement),
      releaseDate: agreement.terms.endDate
    };

    // Create escrow on blockchain
    const escrowResult = await blockchainService.createSecurityDepositEscrow(escrowData);

    // Update agreement with escrow data
    if (!agreement.blockchain.smartContractAddress) {
      agreement.blockchain.smartContractAddress = escrowResult.escrowId;
      await agreement.save();
    }

    res.status(201).json({
      success: true,
      message: 'Security deposit escrow created successfully',
      data: {
        agreementId,
        escrowData: escrowResult
      }
    });

  } catch (error) {
    console.error('Create escrow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create security deposit escrow'
    });
  }
});

// @desc    Release security deposit
// @route   POST /api/blockchain/escrow/:escrowId/release
// @access  Private (Landlord only)
router.post('/escrow/:escrowId/release', protect, authorize('landlord'), [
  body('releaseTo').isIn(['tenant', 'landlord']).withMessage('Release recipient must be tenant or landlord')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { escrowId } = req.params;
    const { releaseTo } = req.body;
    const landlordId = req.user.id;

    // Verify escrow belongs to this landlord
    const agreement = await Agreement.findOne({
      landlord: landlordId,
      'blockchain.smartContractAddress': escrowId
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Escrow not found or access denied'
      });
    }

    // Release deposit
    const releaseResult = await blockchainService.releaseSecurityDeposit(
      escrowId,
      releaseTo === 'tenant'
    );

    res.json({
      success: true,
      message: 'Security deposit released successfully',
      data: {
        escrowId,
        releaseResult
      }
    });

  } catch (error) {
    console.error('Release escrow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to release security deposit'
    });
  }
});

// @desc    Verify document hash
// @route   POST /api/blockchain/verify
// @access  Private
router.post('/verify', protect, [
  body('documentHash').notEmpty().withMessage('Document hash is required'),
  body('transactionHash').notEmpty().withMessage('Transaction hash is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { documentHash, transactionHash } = req.body;

    // Verify document hash on blockchain
    const isValid = await blockchainService.verifyDocumentHash(documentHash, transactionHash);

    res.json({
      success: true,
      data: {
        documentHash,
        transactionHash,
        isValid,
        verifiedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify document'
    });
  }
});

// @desc    Get escrow status
// @route   GET /api/blockchain/escrow/:escrowId
// @access  Private
router.get('/escrow/:escrowId', protect, async (req, res) => {
  try {
    const { escrowId } = req.params;
    const userId = req.user.id;

    // Verify user has access to this escrow
    const query = { 'blockchain.smartContractAddress': escrowId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const agreement = await Agreement.findOne(query);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Escrow not found or access denied'
      });
    }

    // Get escrow status from blockchain
    const escrowStatus = await blockchainService.getEscrowStatus(escrowId);

    res.json({
      success: true,
      data: {
        escrowId,
        agreementId: agreement._id,
        escrowStatus
      }
    });

  } catch (error) {
    console.error('Get escrow status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get escrow status'
    });
  }
});

// @desc    Get transaction details
// @route   GET /api/blockchain/transaction/:transactionHash
// @access  Private
router.get('/transaction/:transactionHash', protect, async (req, res) => {
  try {
    const { transactionHash } = req.params;

    // Get transaction details from blockchain
    const transactionDetails = await blockchainService.getTransactionDetails(transactionHash);

    res.json({
      success: true,
      data: transactionDetails
    });

  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction details'
    });
  }
});

// @desc    Get gas price and wallet balance
// @route   GET /api/blockchain/info
// @access  Private
router.get('/info', protect, async (req, res) => {
  try {
    const gasPrice = await blockchainService.getCurrentGasPrice();
    const balance = await blockchainService.getBalance();

    res.json({
      success: true,
      data: {
        gasPrice,
        walletBalance: balance,
        network: 'Polygon',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get blockchain info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blockchain information'
    });
  }
});

// @desc    Estimate gas for operation
// @route   POST /api/blockchain/estimate-gas
// @access  Private
router.post('/estimate-gas', protect, [
  body('operation').isIn(['createEscrow', 'releaseToTenant', 'releaseToLandlord']).withMessage('Invalid operation'),
  body('params').isArray().withMessage('Parameters must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { operation, params } = req.body;

    // Estimate gas for the operation
    const estimatedGas = await blockchainService.estimateGas(operation, params);
    const gasPrice = await blockchainService.getCurrentGasPrice();
    
    // Calculate estimated cost
    const estimatedCostWei = BigInt(estimatedGas) * BigInt(gasPrice);
    const estimatedCostEth = estimatedCostWei.toString() / (10 ** 18);

    res.json({
      success: true,
      data: {
        operation,
        estimatedGas,
        gasPrice,
        estimatedCostWei: estimatedCostWei.toString(),
        estimatedCostEth: estimatedCostEth.toString()
      }
    });

  } catch (error) {
    console.error('Estimate gas error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to estimate gas'
    });
  }
});

module.exports = router;