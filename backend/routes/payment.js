const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Agreement = require('../models/Agreement');
const Property = require('../models/Property');
const User = require('../models/User');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
router.post('/create-order', protect, [
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('currency').optional().isIn(['INR']).withMessage('Currency must be INR'),
  body('propertyId').isMongoId().withMessage('Valid property ID is required'),
  body('type').isIn(['rent', 'security_deposit', 'maintenance', 'late_fee', 'penalty']).withMessage('Invalid payment type')
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

    const { amount, currency = 'INR', propertyId, type, period } = req.body;
    const userId = req.user.id;

    // Verify the user has access to this property
    let agreement;
    if (req.user.role === 'tenant') {
      agreement = await Agreement.findOne({
        tenant: userId,
        property: propertyId,
        status: 'active'
      }).populate('landlord');
    } else if (req.user.role === 'landlord') {
      agreement = await Agreement.findOne({
        landlord: userId,
        property: propertyId,
        status: 'active'
      }).populate('tenant');
    }

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'No active agreement found for this property'
      });
    }

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Create payment record in database
    const paymentData = {
      property: propertyId,
      agreement: agreement._id,
      landlord: agreement.landlord._id,
      tenant: agreement.tenant._id,
      type: type,
      amount: {
        total: amount,
        rent: type === 'rent' ? amount : 0,
        maintenance: type === 'maintenance' ? amount : 0,
        lateFee: type === 'late_fee' ? amount : 0,
        penalty: type === 'penalty' ? amount : 0
      },
      period: period || {},
      dueDate: req.body.dueDate || new Date(),
      gateway: {
        provider: 'razorpay',
        gatewayOrderId: razorpayOrder.id
      },
      method: 'pending' // Will be updated when payment is captured
    };

    const payment = await Payment.create(paymentData);

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id,
        key: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
router.post('/verify', protect, [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required'),
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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId
    } = req.body;

    // Find the payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      payment.status = 'failed';
      payment.gateway.gatewayResponse = {
        error: 'Invalid signature',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      };
      await payment.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update payment record
    payment.status = 'completed';
    payment.paidDate = new Date();
    payment.method = razorpayPayment.method;
    payment.gateway.gatewayPaymentId = razorpay_payment_id;
    payment.gateway.gatewaySignature = razorpay_signature;
    payment.gateway.gatewayResponse = razorpayPayment;

    // Generate receipt
    payment.receipt.generated = true;
    payment.receipt.generatedAt = new Date();
    
    await payment.save();

    // TODO: Generate PDF receipt
    // TODO: Send notification to landlord
    // TODO: Update blockchain record

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        razorpayPayment
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// @desc    Handle Razorpay webhook
// @route   POST /api/payment/webhook
// @access  Public (webhook)
router.post('/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload.payment.entity);
        break;
      case 'refund.created':
        await handleRefundCreated(payload.refund.entity);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private
router.get('/:paymentId', protect, async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    // Build query based on user role
    const query = { _id: paymentId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const payment = await Payment.findOne(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create manual payment record
// @route   POST /api/payment/manual
// @access  Private (Landlord only)
router.post('/manual', protect, [
  body('tenantId').isMongoId().withMessage('Valid tenant ID is required'),
  body('propertyId').isMongoId().withMessage('Valid property ID is required'),
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Valid amount is required'),
  body('type').isIn(['rent', 'security_deposit', 'maintenance', 'late_fee', 'penalty']).withMessage('Invalid payment type'),
  body('method').isIn(['cash', 'cheque', 'bank_transfer']).withMessage('Invalid payment method'),
  body('paidDate').isISO8601().withMessage('Valid paid date is required')
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

    // Only landlords can create manual payments
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can create manual payment records'
      });
    }

    const {
      tenantId,
      propertyId,
      amount,
      type,
      method,
      paidDate,
      period,
      manualPayment,
      notes
    } = req.body;

    const landlordId = req.user.id;

    // Verify the agreement
    const agreement = await Agreement.findOne({
      landlord: landlordId,
      tenant: tenantId,
      property: propertyId,
      status: 'active'
    });

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'No active agreement found'
      });
    }

    const paymentData = {
      property: propertyId,
      agreement: agreement._id,
      landlord: landlordId,
      tenant: tenantId,
      type: type,
      amount: {
        total: amount,
        rent: type === 'rent' ? amount : 0,
        maintenance: type === 'maintenance' ? amount : 0,
        lateFee: type === 'late_fee' ? amount : 0,
        penalty: type === 'penalty' ? amount : 0
      },
      period: period || {},
      dueDate: req.body.dueDate || new Date(),
      paidDate: new Date(paidDate),
      status: 'completed',
      gateway: {
        provider: 'manual'
      },
      method: method,
      manualPayment: manualPayment || {},
      notes: notes,
      processedBy: landlordId,
      processedAt: new Date()
    };

    const payment = await Payment.create(paymentData);

    // Generate receipt
    payment.receipt.generated = true;
    payment.receipt.generatedAt = new Date();
    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Manual payment record created successfully',
      data: payment
    });

  } catch (error) {
    console.error('Create manual payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payment/:paymentId/refund
// @access  Private (Landlord only)
router.post('/:paymentId/refund', protect, [
  body('amount').isNumeric().isFloat({ min: 1 }).withMessage('Valid refund amount is required'),
  body('reason').trim().isLength({ min: 5, max: 200 }).withMessage('Refund reason is required')
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

    // Only landlords can process refunds
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can process refunds'
      });
    }

    const { paymentId } = req.params;
    const { amount, reason } = req.body;
    const landlordId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      landlord: landlordId,
      status: 'completed'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or cannot be refunded'
      });
    }

    if (amount > payment.amount.total) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount'
      });
    }

    // Process refund via Razorpay if it was a gateway payment
    let refundResult = null;
    if (payment.gateway.provider === 'razorpay' && payment.gateway.gatewayPaymentId) {
      try {
        refundResult = await razorpay.payments.refund(payment.gateway.gatewayPaymentId, {
          amount: Math.round(amount * 100) // Convert to paise
        });
      } catch (error) {
        console.error('Razorpay refund error:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to process refund via payment gateway'
        });
      }
    }

    // Update payment record
    payment.refund = {
      isRefunded: true,
      refundAmount: amount,
      refundDate: new Date(),
      refundReason: reason,
      refundTransactionId: refundResult?.id || null
    };

    if (amount === payment.amount.total) {
      payment.status = 'refunded';
    }

    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        payment,
        refundResult
      }
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to handle payment captured webhook
async function handlePaymentCaptured(paymentEntity) {
  try {
    const payment = await Payment.findOne({
      'gateway.gatewayOrderId': paymentEntity.order_id
    });

    if (payment) {
      payment.status = 'completed';
      payment.paidDate = new Date(paymentEntity.created_at * 1000);
      payment.method = paymentEntity.method;
      payment.gateway.gatewayPaymentId = paymentEntity.id;
      payment.gateway.gatewayResponse = paymentEntity;

      await payment.save();
      console.log(`Payment ${payment._id} marked as completed via webhook`);
    }
  } catch (error) {
    console.error('Error handling payment captured webhook:', error);
  }
}

// Helper function to handle payment failed webhook
async function handlePaymentFailed(paymentEntity) {
  try {
    const payment = await Payment.findOne({
      'gateway.gatewayOrderId': paymentEntity.order_id
    });

    if (payment) {
      payment.status = 'failed';
      payment.gateway.gatewayResponse = paymentEntity;

      await payment.save();
      console.log(`Payment ${payment._id} marked as failed via webhook`);
    }
  } catch (error) {
    console.error('Error handling payment failed webhook:', error);
  }
}

// Helper function to handle refund created webhook
async function handleRefundCreated(refundEntity) {
  try {
    const payment = await Payment.findOne({
      'gateway.gatewayPaymentId': refundEntity.payment_id
    });

    if (payment) {
      payment.refund = {
        ...payment.refund,
        isRefunded: true,
        refundTransactionId: refundEntity.id,
        refundDate: new Date(refundEntity.created_at * 1000)
      };

      if (refundEntity.amount === payment.amount.total * 100) {
        payment.status = 'refunded';
      }

      await payment.save();
      console.log(`Refund processed for payment ${payment._id} via webhook`);
    }
  } catch (error) {
    console.error('Error handling refund created webhook:', error);
  }
}

module.exports = router;