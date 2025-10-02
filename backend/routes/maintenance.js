const express = require('express');
const { protect } = require('../middleware/auth');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const router = express.Router();

// @desc    Get maintenance requests (for both tenant and landlord)
// @route   GET /api/maintenance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, property, page = 1, limit = 10 } = req.query;

    // Build query based on user role
    const query = {};
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (property) query.property = property;

    const maintenanceRequests = await MaintenanceRequest.find(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
      .populate('landlord', 'name email phone')
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
// @route   GET /api/maintenance/:requestId
// @access  Private
router.get('/:requestId', protect, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Build query based on user role
    const query = { _id: requestId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const maintenanceRequest = await MaintenanceRequest.findOne(query)
      .populate('property', 'title address')
      .populate('tenant', 'name email phone')
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

// @desc    Add communication to maintenance request
// @route   POST /api/maintenance/:requestId/communication
// @access  Private
router.post('/:requestId/communication', protect, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message, type = 'message', attachments = [] } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Build query based on user role
    const query = { _id: requestId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const maintenanceRequest = await MaintenanceRequest.findOne(query);

    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    // Determine recipient based on sender
    let recipientId;
    if (req.user.role === 'tenant') {
      recipientId = maintenanceRequest.landlord;
    } else {
      recipientId = maintenanceRequest.tenant;
    }

    // Add communication
    const communication = {
      sender: userId,
      recipient: recipientId,
      message: message.trim(),
      type,
      attachments,
      timestamp: new Date()
    };

    maintenanceRequest.communications.push(communication);
    await maintenanceRequest.save();

    res.json({
      success: true,
      message: 'Communication added successfully',
      data: communication
    });

  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;