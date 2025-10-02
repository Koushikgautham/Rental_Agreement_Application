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
router.use(authorize('landlord'));
router.use(checkActiveUser);

// @desc    Get landlord dashboard data
// @route   GET /api/landlord/dashboard
// @access  Private (Landlord only)
router.get('/dashboard', async (req, res) => {
  try {
    const landlordId = req.user.id;

    // Get properties count
    const totalProperties = await Property.countDocuments({ landlord: landlordId });
    const occupiedProperties = await Property.countDocuments({ 
      landlord: landlordId, 
      status: 'occupied' 
    });
    const availableProperties = await Property.countDocuments({ 
      landlord: landlordId, 
      status: 'available' 
    });

    // Get total tenants
    const totalTenants = await Agreement.countDocuments({
      landlord: landlordId,
      status: 'active'
    });

    // Get this month's payment summary
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyPayments = await Payment.find({
      landlord: landlordId,
      'period.month': currentMonth,
      'period.year': currentYear
    });

    const expectedIncome = monthlyPayments.reduce((sum, payment) => sum + payment.amount.total, 0);
    const collectedIncome = monthlyPayments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount.total, 0);
    const pendingIncome = expectedIncome - collectedIncome;

    // Get pending maintenance requests
    const pendingMaintenance = await MaintenanceRequest.countDocuments({
      landlord: landlordId,
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get recent payments
    const recentPayments = await Payment.find({
      landlord: landlordId,
      status: 'completed'
    }).populate('tenant', 'name')
      .populate('property', 'title')
      .sort({ paidDate: -1 })
      .limit(5);

    // Get overdue payments
    const overduePayments = await Payment.find({
      landlord: landlordId,
      status: 'pending',
      dueDate: { $lt: new Date() }
    }).populate('tenant', 'name')
      .populate('property', 'title');

    // Get expiring agreements (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringAgreements = await Agreement.find({
      landlord: landlordId,
      status: 'active',
      'terms.endDate': { $lte: thirtyDaysFromNow }
    }).populate('tenant', 'name')
      .populate('property', 'title');

    res.json({
      success: true,
      data: {
        summary: {
          totalProperties,
          occupiedProperties,
          availableProperties,
          totalTenants,
          expectedIncome,
          collectedIncome,
          pendingIncome,
          pendingMaintenance
        },
        recentPayments,
        overduePayments,
        expiringAgreements
      }
    });

  } catch (error) {
    console.error('Landlord dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all properties
// @route   GET /api/landlord/properties
// @access  Private (Landlord only)
router.get('/properties', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { landlord: landlordId };
    if (status) {
      query.status = status;
    }

    const properties = await Property.find(query)
      .populate('currentTenant', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new property
// @route   POST /api/landlord/properties
// @access  Private (Landlord only)
router.post('/properties', [
  body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('type').isIn(['apartment', 'house', 'villa', 'studio', 'room', 'commercial', 'office']).withMessage('Invalid property type'),
  body('address.street').trim().notEmpty().withMessage('Street address is required'),
  body('address.area').trim().notEmpty().withMessage('Area is required'),
  body('address.city').trim().notEmpty().withMessage('City is required'),
  body('address.state').trim().notEmpty().withMessage('State is required'),
  body('address.pincode').matches(/^\d{6}$/).withMessage('Valid pincode is required'),
  body('monthlyRent').isNumeric().isFloat({ min: 0 }).withMessage('Valid monthly rent is required'),
  body('securityDeposit').isNumeric().isFloat({ min: 0 }).withMessage('Valid security deposit is required')
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

    const landlordId = req.user.id;

    const propertyData = {
      ...req.body,
      landlord: landlordId
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get specific property
// @route   GET /api/landlord/properties/:propertyId
// @access  Private (Landlord only)
router.get('/properties/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.user.id;

    const property = await Property.findOne({
      _id: propertyId,
      landlord: landlordId
    }).populate('currentTenant', 'name email phone profile');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Get current agreement if property is occupied
    let currentAgreement = null;
    if (property.currentTenant) {
      currentAgreement = await Agreement.findOne({
        property: propertyId,
        status: 'active'
      });
    }

    res.json({
      success: true,
      data: {
        property,
        currentAgreement
      }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update property
// @route   PUT /api/landlord/properties/:propertyId
// @access  Private (Landlord only)
router.put('/properties/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.user.id;

    const property = await Property.findOne({
      _id: propertyId,
      landlord: landlordId
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const allowedFields = [
      'title', 'description', 'monthlyRent', 'securityDeposit', 
      'maintenanceCharges', 'amenities', 'specifications', 
      'images', 'documents', 'preferences', 'rentCycle'
    ];

    const fieldsToUpdate = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete property
// @route   DELETE /api/landlord/properties/:propertyId
// @access  Private (Landlord only)
router.delete('/properties/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.user.id;

    const property = await Property.findOne({
      _id: propertyId,
      landlord: landlordId
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if property has active agreements
    const activeAgreement = await Agreement.findOne({
      property: propertyId,
      status: 'active'
    });

    if (activeAgreement) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete property with active agreement'
      });
    }

    await Property.findByIdAndDelete(propertyId);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get property payment history
// @route   GET /api/landlord/properties/:propertyId/payments
// @access  Private (Landlord only)
router.get('/properties/:propertyId/payments', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const landlordId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    // Verify property ownership
    const property = await Property.findOne({
      _id: propertyId,
      landlord: landlordId
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const query = { property: propertyId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('tenant', 'name email phone')
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
    console.error('Property payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all agreements
// @route   GET /api/landlord/agreements
// @access  Private (Landlord only)
router.get('/agreements', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { landlord: landlordId };
    if (status) {
      query.status = status;
    }

    const agreements = await Agreement.find(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Agreement.countDocuments(query);

    res.json({
      success: true,
      data: {
        agreements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get agreements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all payments
// @route   GET /api/landlord/payments
// @access  Private (Landlord only)
router.get('/payments', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const { status, property, tenant, page = 1, limit = 10, startDate, endDate } = req.query;

    const query = { landlord: landlordId };

    if (status) query.status = status;
    if (property) query.property = property;
    if (tenant) query.tenant = tenant;

    // Add date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    // Calculate summary
    const totalAmount = await Payment.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount.total' } } }
    ]);

    res.json({
      success: true,
      data: {
        payments,
        summary: {
          totalAmount: totalAmount[0]?.total || 0
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get maintenance requests
// @route   GET /api/landlord/maintenance
// @access  Private (Landlord only)
router.get('/maintenance', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const { status, priority, property, page = 1, limit = 10 } = req.query;

    const query = { landlord: landlordId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (property) query.property = property;

    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
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

// @desc    Update maintenance request status
// @route   PUT /api/landlord/maintenance/:requestId
// @access  Private (Landlord only)
router.put('/maintenance/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const landlordId = req.user.id;

    const maintenanceRequest = await MaintenanceRequest.findOne({
      _id: requestId,
      landlord: landlordId
    });

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    const {
      status,
      serviceProvider,
      cost,
      timeline,
      workDetails,
      completion,
      notes
    } = req.body;

    const fieldsToUpdate = {};
    
    if (status) fieldsToUpdate.status = status;
    if (serviceProvider) fieldsToUpdate.serviceProvider = serviceProvider;
    if (cost) fieldsToUpdate.cost = cost;
    if (timeline) fieldsToUpdate.timeline = { ...maintenanceRequest.timeline, ...timeline };
    if (workDetails) fieldsToUpdate.workDetails = workDetails;
    if (completion) fieldsToUpdate.completion = completion;
    if (notes) fieldsToUpdate.internalNotes = notes;

    // Update acknowledgment timestamp
    if (status === 'acknowledged' && !maintenanceRequest.timeline.acknowledgedAt) {
      fieldsToUpdate['timeline.acknowledgedAt'] = new Date();
    }

    // Update start timestamp
    if (status === 'in_progress' && !maintenanceRequest.timeline.startedAt) {
      fieldsToUpdate['timeline.startedAt'] = new Date();
    }

    // Update completion timestamp
    if (status === 'completed' && !maintenanceRequest.timeline.completedAt) {
      fieldsToUpdate['timeline.completedAt'] = new Date();
    }

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

// @desc    Get analytics/reports
// @route   GET /api/landlord/analytics
// @access  Private (Landlord only)
router.get('/analytics', async (req, res) => {
  try {
    const landlordId = req.user.id;
    const { year = new Date().getFullYear(), month } = req.query;

    // Monthly income report
    const monthlyIncomeQuery = {
      landlord: landlordId,
      status: 'completed',
      'period.year': parseInt(year)
    };

    if (month) {
      monthlyIncomeQuery['period.month'] = parseInt(month);
    }

    const monthlyIncome = await Payment.aggregate([
      { $match: monthlyIncomeQuery },
      {
        $group: {
          _id: { month: '$period.month', year: '$period.year' },
          totalIncome: { $sum: '$amount.total' },
          rentIncome: { $sum: '$amount.rent' },
          maintenanceIncome: { $sum: '$amount.maintenance' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Property occupancy rates
    const propertyStats = await Property.aggregate([
      { $match: { landlord: landlordId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Overdue payments
    const overduePayments = await Payment.find({
      landlord: landlordId,
      status: 'pending',
      dueDate: { $lt: new Date() }
    }).populate('tenant', 'name')
      .populate('property', 'title');

    // Maintenance request trends
    const maintenanceStats = await MaintenanceRequest.aggregate([
      { $match: { landlord: landlordId } },
      {
        $group: {
          _id: { category: '$category', status: '$status' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        monthlyIncome,
        propertyStats,
        overduePayments,
        maintenanceStats,
        year: parseInt(year),
        month: month ? parseInt(month) : null
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get tenants list
// @route   GET /api/landlord/tenants
// @access  Private (Landlord only)
router.get('/tenants', async (req, res) => {
  try {
    const landlordId = req.user.id;

    // Get all tenants with active agreements
    const tenants = await Agreement.find({
      landlord: landlordId,
      status: 'active'
    }).populate('tenant', 'name email phone profile')
      .populate('property', 'title address monthlyRent');

    res.json({
      success: true,
      data: tenants
    });

  } catch (error) {
    console.error('Get tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get specific tenant details
// @route   GET /api/landlord/tenants/:tenantId
// @access  Private (Landlord only)
router.get('/tenants/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const landlordId = req.user.id;

    // Verify that this tenant is associated with the landlord
    const agreement = await Agreement.findOne({
      landlord: landlordId,
      tenant: tenantId,
      status: 'active'
    }).populate('tenant')
      .populate('property');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Get payment history for this tenant
    const payments = await Payment.find({
      landlord: landlordId,
      tenant: tenantId
    }).populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get maintenance requests by this tenant
    const maintenanceRequests = await MaintenanceRequest.find({
      landlord: landlordId,
      tenant: tenantId
    }).populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        agreement,
        tenant: agreement.tenant,
        property: agreement.property,
        recentPayments: payments,
        recentMaintenanceRequests: maintenanceRequests
      }
    });

  } catch (error) {
    console.error('Get tenant details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;