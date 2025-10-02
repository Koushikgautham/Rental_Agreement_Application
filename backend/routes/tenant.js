const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize, checkActiveUser } = require('../middleware/auth');
const User = require('../models/User');
const Property = require('../models/Property');
const Agreement = require('../models/Agreement');
const Payment = require('../models/Payment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const router = express.Router();

// Apply middleware to all routes
router.use(protect);
router.use(authorize('tenant'));
router.use(checkActiveUser);

// @desc    Get tenant dashboard data
// @route   GET /api/tenant/dashboard
// @access  Private (Tenant only)
router.get('/dashboard', async (req, res) => {
  try {
    const tenantId = req.user.id;
    
    // Get current property and agreement
    const currentAgreement = await Agreement.findOne({
      tenant: tenantId,
      status: 'active'
    }).populate('property');

    if (!currentAgreement) {
      return res.json({
        success: true,
        data: {
          hasActiveAgreement: false,
          message: 'No active rental agreement found'
        }
      });
    }

    // Get pending payments
    const pendingPayments = await Payment.find({
      tenant: tenantId,
      status: { $in: ['pending', 'overdue'] }
    }).sort({ dueDate: 1 });

    // Get recent payments
    const recentPayments = await Payment.find({
      tenant: tenantId,
      status: 'completed'
    }).sort({ paidDate: -1 }).limit(5);

    // Get active maintenance requests
    const maintenanceRequests = await MaintenanceRequest.find({
      tenant: tenantId,
      status: { $nin: ['completed', 'cancelled'] }
    }).sort({ createdAt: -1 });

    // Calculate next rent due
    const today = new Date();
    const nextRentDue = new Date(today.getFullYear(), today.getMonth() + 1, currentAgreement.terms.rentDueDate);

    res.json({
      success: true,
      data: {
        hasActiveAgreement: true,
        currentProperty: currentAgreement.property,
        agreement: currentAgreement,
        pendingPayments,
        recentPayments,
        maintenanceRequests,
        nextRentDue,
        totalPendingAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount.total, 0)
      }
    });

  } catch (error) {
    console.error('Tenant dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get tenant's rent calendar
// @route   GET /api/tenant/rent-calendar
// @access  Private (Tenant only)
router.get('/rent-calendar', async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { year, month } = req.query;

    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;

    // Get all payments for the tenant in the specified month/year
    const payments = await Payment.find({
      tenant: tenantId,
      $or: [
        {
          'period.year': currentYear,
          'period.month': currentMonth
        },
        {
          dueDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lt: new Date(currentYear, currentMonth, 1)
          }
        }
      ]
    }).populate('property', 'title address');

    // Generate calendar data
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth - 1, day);
      const dayPayments = payments.filter(payment => {
        const dueDate = new Date(payment.dueDate);
        return dueDate.getDate() === day;
      });

      calendar.push({
        date,
        day,
        payments: dayPayments,
        hasPayment: dayPayments.length > 0,
        isPaid: dayPayments.every(p => p.status === 'completed'),
        isOverdue: dayPayments.some(p => p.status === 'overdue' || (p.status === 'pending' && new Date() > p.dueDate))
      });
    }

    res.json({
      success: true,
      data: {
        year: currentYear,
        month: currentMonth,
        calendar,
        totalPayments: payments.length,
        totalAmount: payments.reduce((sum, payment) => sum + payment.amount.total, 0)
      }
    });

  } catch (error) {
    console.error('Rent calendar error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get pending payments
// @route   GET /api/tenant/payments/pending
// @access  Private (Tenant only)
router.get('/payments/pending', async (req, res) => {
  try {
    const tenantId = req.user.id;

    const pendingPayments = await Payment.find({
      tenant: tenantId,
      status: { $in: ['pending', 'overdue'] }
    }).populate('property', 'title address monthlyRent')
      .sort({ dueDate: 1 });

    // Calculate overdue payments
    const overduePayments = pendingPayments.filter(payment => 
      new Date() > new Date(payment.dueDate)
    );

    res.json({
      success: true,
      data: {
        pendingPayments,
        overduePayments,
        totalPendingAmount: pendingPayments.reduce((sum, payment) => sum + payment.amount.total, 0),
        totalOverdueAmount: overduePayments.reduce((sum, payment) => sum + payment.amount.total, 0)
      }
    });

  } catch (error) {
    console.error('Pending payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get payment history
// @route   GET /api/tenant/payments/history
// @access  Private (Tenant only)
router.get('/payments/history', async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const query = { tenant: tenantId };

    // Add status filter
    if (status) {
      query.status = status;
    }

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('property', 'title address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get payment receipt
// @route   GET /api/tenant/payments/:paymentId/receipt
// @access  Private (Tenant only)
router.get('/payments/:paymentId/receipt', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const tenantId = req.user.id;

    const payment = await Payment.findOne({
      _id: paymentId,
      tenant: tenantId,
      status: 'completed'
    }).populate('property', 'title address')
      .populate('landlord', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment receipt not found'
      });
    }

    // TODO: Generate PDF receipt if not exists
    
    res.json({
      success: true,
      data: {
        payment,
        receiptUrl: payment.receipt.receiptUrl,
        receiptNumber: payment.receipt.receiptNumber
      }
    });

  } catch (error) {
    console.error('Payment receipt error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get current agreement
// @route   GET /api/tenant/agreement
// @access  Private (Tenant only)
router.get('/agreement', async (req, res) => {
  try {
    const tenantId = req.user.id;

    const agreement = await Agreement.findOne({
      tenant: tenantId,
      status: 'active'
    }).populate('property')
      .populate('landlord', 'name email phone');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'No active agreement found'
      });
    }

    res.json({
      success: true,
      data: agreement
    });

  } catch (error) {
    console.error('Get agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get agreement history
// @route   GET /api/tenant/agreements/history
// @access  Private (Tenant only)
router.get('/agreements/history', async (req, res) => {
  try {
    const tenantId = req.user.id;

    const agreements = await Agreement.find({
      tenant: tenantId
    }).populate('property', 'title address')
      .populate('landlord', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: agreements
    });

  } catch (error) {
    console.error('Agreement history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create maintenance request
// @route   POST /api/tenant/maintenance
// @access  Private (Tenant only)
router.post('/maintenance', [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'appliance_repair', 'pest_control', 'security', 'garden', 'hvac', 'roofing', 'flooring', 'door_window', 'other']).withMessage('Invalid category'),
  body('priority').isIn(['low', 'medium', 'high', 'emergency']).withMessage('Invalid priority'),
  body('location').trim().isLength({ min: 3, max: 200 }).withMessage('Location must be between 3 and 200 characters')
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

    const tenantId = req.user.id;

    // Get current property and landlord
    const agreement = await Agreement.findOne({
      tenant: tenantId,
      status: 'active'
    });

    if (!agreement) {
      return res.status(400).json({
        success: false,
        message: 'No active rental agreement found'
      });
    }

    const {
      title,
      description,
      category,
      priority,
      location,
      attachments,
      urgency,
      availability
    } = req.body;

    const maintenanceRequest = await MaintenanceRequest.create({
      property: agreement.property,
      tenant: tenantId,
      landlord: agreement.landlord,
      title,
      description,
      category,
      priority,
      location,
      attachments: attachments || [],
      urgency: urgency || {},
      availability: availability || {}
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: maintenanceRequest
    });

  } catch (error) {
    console.error('Create maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get tenant's maintenance requests
// @route   GET /api/tenant/maintenance
// @access  Private (Tenant only)
router.get('/maintenance', async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { tenant: tenantId };
    if (status) {
      query.status = status;
    }

    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('property', 'title address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MaintenanceRequest.countDocuments(query);

    res.json({
      success: true,
      data: {
        maintenanceRequests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get maintenance requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get specific maintenance request
// @route   GET /api/tenant/maintenance/:requestId
// @access  Private (Tenant only)
router.get('/maintenance/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const tenantId = req.user.id;

    const maintenanceRequest = await MaintenanceRequest.findOne({
      _id: requestId,
      tenant: tenantId
    }).populate('property', 'title address')
      .populate('landlord', 'name email phone');

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      data: maintenanceRequest
    });

  } catch (error) {
    console.error('Get maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update maintenance request (tenant can only update before acknowledgment)
// @route   PUT /api/tenant/maintenance/:requestId
// @access  Private (Tenant only)
router.put('/maintenance/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const tenantId = req.user.id;

    const maintenanceRequest = await MaintenanceRequest.findOne({
      _id: requestId,
      tenant: tenantId
    });

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Only allow updates if request is still open
    if (maintenanceRequest.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update maintenance request after it has been acknowledged'
      });
    }

    const allowedFields = ['title', 'description', 'category', 'priority', 'location', 'attachments', 'urgency', 'availability'];
    const fieldsToUpdate = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
      requestId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Maintenance request updated successfully',
      data: updatedRequest
    });

  } catch (error) {
    console.error('Update maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel maintenance request
// @route   DELETE /api/tenant/maintenance/:requestId
// @access  Private (Tenant only)
router.delete('/maintenance/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const tenantId = req.user.id;

    const maintenanceRequest = await MaintenanceRequest.findOne({
      _id: requestId,
      tenant: tenantId
    });

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Only allow cancellation if request is not completed
    if (maintenanceRequest.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed maintenance request'
      });
    }

    maintenanceRequest.cancellation = {
      isCancelled: true,
      cancelledBy: tenantId,
      cancelledAt: new Date(),
      reason: req.body.reason || 'Cancelled by tenant'
    };
    maintenanceRequest.status = 'cancelled';

    await maintenanceRequest.save();

    res.json({
      success: true,
      message: 'Maintenance request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel maintenance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Submit satisfaction rating for completed maintenance
// @route   POST /api/tenant/maintenance/:requestId/rating
// @access  Private (Tenant only)
router.post('/maintenance/:requestId/rating', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim().isLength({ max: 500 }).withMessage('Feedback cannot exceed 500 characters')
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

    const { requestId } = req.params;
    const tenantId = req.user.id;
    const { rating, feedback } = req.body;

    const maintenanceRequest = await MaintenanceRequest.findOne({
      _id: requestId,
      tenant: tenantId,
      status: 'completed'
    });

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Completed maintenance request not found'
      });
    }

    if (maintenanceRequest.completion.tenantSatisfaction.rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating already submitted for this maintenance request'
      });
    }

    maintenanceRequest.completion.tenantSatisfaction = {
      rating,
      feedback: feedback || '',
      submittedAt: new Date()
    };

    await maintenanceRequest.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;