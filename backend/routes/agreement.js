const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Agreement = require('../models/Agreement');
const Property = require('../models/Property');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF and image files
    const allowedTypes = /pdf|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// @desc    Create new agreement
// @route   POST /api/agreement
// @access  Private (Landlord only)
router.post('/', protect, upload.single('agreementFile'), [
  body('propertyId').isMongoId().withMessage('Valid property ID is required'),
  body('tenantId').isMongoId().withMessage('Valid tenant ID is required'),
  body('terms.monthlyRent').isNumeric().isFloat({ min: 0 }).withMessage('Valid monthly rent is required'),
  body('terms.securityDeposit').isNumeric().isFloat({ min: 0 }).withMessage('Valid security deposit is required'),
  body('terms.startDate').isISO8601().withMessage('Valid start date is required'),
  body('terms.endDate').isISO8601().withMessage('Valid end date is required'),
  body('terms.duration').isNumeric().isInt({ min: 1 }).withMessage('Valid duration is required')
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

    // Only landlords can create agreements
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can create agreements'
      });
    }

    const { propertyId, tenantId, terms, clauses, witnesses } = req.body;
    const landlordId = req.user.id;

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

    // Verify tenant exists
    const tenant = await User.findOne({
      _id: tenantId,
      role: 'tenant'
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    // Check if there's already an active agreement
    const existingAgreement = await Agreement.findOne({
      property: propertyId,
      status: 'active'
    });

    if (existingAgreement) {
      return res.status(400).json({
        success: false,
        message: 'Property already has an active agreement'
      });
    }

    // Parse dates
    const startDate = new Date(terms.startDate);
    const endDate = new Date(terms.endDate);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const agreementData = {
      property: propertyId,
      landlord: landlordId,
      tenant: tenantId,
      terms: {
        ...terms,
        startDate,
        endDate
      },
      clauses: clauses || {},
      witnesses: witnesses || []
    };

    // Handle file upload if present
    if (req.file) {
      // TODO: Upload to AWS S3 or Firebase Storage
      agreementData.documents = {
        originalFile: {
          name: req.file.originalname,
          size: req.file.size,
          uploadDate: new Date()
          // url: uploadedFileUrl
        }
      };
    }

    const agreement = await Agreement.create(agreementData);

    // Update property status
    await Property.findByIdAndUpdate(propertyId, {
      currentTenant: tenantId,
      status: 'occupied'
    });

    // TODO: Store agreement hash on blockchain
    
    res.status(201).json({
      success: true,
      message: 'Agreement created successfully',
      data: agreement
    });

  } catch (error) {
    console.error('Create agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get agreement details
// @route   GET /api/agreement/:agreementId
// @access  Private
router.get('/:agreementId', protect, async (req, res) => {
  try {
    const { agreementId } = req.params;
    const userId = req.user.id;

    // Build query based on user role
    const query = { _id: agreementId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const agreement = await Agreement.findOne(query)
      .populate('property')
      .populate('landlord', 'name email phone')
      .populate('tenant', 'name email phone');

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
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

// @desc    Update agreement
// @route   PUT /api/agreement/:agreementId
// @access  Private (Landlord only)
router.put('/:agreementId', protect, async (req, res) => {
  try {
    // Only landlords can update agreements
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can update agreements'
      });
    }

    const { agreementId } = req.params;
    const landlordId = req.user.id;

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

    // Only allow updates to draft agreements
    if (agreement.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft agreements can be updated'
      });
    }

    const allowedFields = ['terms', 'clauses', 'witnesses'];
    const fieldsToUpdate = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    const updatedAgreement = await Agreement.findByIdAndUpdate(
      agreementId,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Agreement updated successfully',
      data: updatedAgreement
    });

  } catch (error) {
    console.error('Update agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Sign agreement
// @route   POST /api/agreement/:agreementId/sign
// @access  Private
router.post('/:agreementId/sign', protect, [
  body('signatureHash').notEmpty().withMessage('Signature hash is required')
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

    const { agreementId } = req.params;
    const { signatureHash } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build query based on user role
    const query = { _id: agreementId };
    if (userRole === 'tenant') {
      query.tenant = userId;
    } else if (userRole === 'landlord') {
      query.landlord = userId;
    }

    const agreement = await Agreement.findOne(query);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    // Check if already signed
    const signatureField = userRole === 'tenant' ? 'tenant' : 'landlord';
    if (agreement.signatures[signatureField].signed) {
      return res.status(400).json({
        success: false,
        message: 'Agreement already signed by you'
      });
    }

    // Update signature
    agreement.signatures[signatureField] = {
      signed: true,
      signedAt: new Date(),
      signatureHash: signatureHash,
      ipAddress: req.ip
    };

    // Check if both parties have signed
    const bothSigned = agreement.signatures.landlord.signed && agreement.signatures.tenant.signed;
    if (bothSigned) {
      agreement.status = 'active';
    } else {
      agreement.status = 'pending_signatures';
    }

    await agreement.save();

    // TODO: Store signature hash on blockchain

    res.json({
      success: true,
      message: 'Agreement signed successfully',
      data: {
        agreement,
        bothSigned
      }
    });

  } catch (error) {
    console.error('Sign agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Upload agreement document
// @route   POST /api/agreement/:agreementId/upload
// @access  Private (Landlord only)
router.post('/:agreementId/upload', protect, upload.single('document'), async (req, res) => {
  try {
    // Only landlords can upload documents
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can upload agreement documents'
      });
    }

    const { agreementId } = req.params;
    const landlordId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

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

    // TODO: Upload file to AWS S3 or Firebase Storage
    const fileUrl = 'https://example.com/agreements/' + req.file.originalname;

    // Update agreement with file info
    if (req.body.type === 'signed') {
      agreement.documents.signedFile = {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
        uploadDate: new Date()
      };
    } else {
      agreement.documents.originalFile = {
        url: fileUrl,
        name: req.file.originalname,
        size: req.file.size,
        uploadDate: new Date()
      };
    }

    await agreement.save();

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        fileUrl,
        fileName: req.file.originalname
      }
    });

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Terminate agreement
// @route   POST /api/agreement/:agreementId/terminate
// @access  Private
router.post('/:agreementId/terminate', protect, [
  body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Termination reason is required'),
  body('terminationDate').isISO8601().withMessage('Valid termination date is required')
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

    const { agreementId } = req.params;
    const { reason, terminationDate, depositStatus } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build query based on user role
    const query = { _id: agreementId };
    if (userRole === 'tenant') {
      query.tenant = userId;
    } else if (userRole === 'landlord') {
      query.landlord = userId;
    }

    const agreement = await Agreement.findOne(query);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    if (agreement.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active agreements can be terminated'
      });
    }

    // Update agreement termination details
    agreement.termination = {
      isTerminated: true,
      terminationDate: new Date(terminationDate),
      terminationReason: reason,
      terminatedBy: userRole,
      depositStatus: depositStatus || 'pending'
    };

    agreement.status = 'terminated';

    await agreement.save();

    // Update property status
    await Property.findByIdAndUpdate(agreement.property, {
      currentTenant: null,
      status: 'available'
    });

    res.json({
      success: true,
      message: 'Agreement terminated successfully',
      data: agreement
    });

  } catch (error) {
    console.error('Terminate agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Renew agreement
// @route   POST /api/agreement/:agreementId/renew
// @access  Private (Landlord only)
router.post('/:agreementId/renew', protect, [
  body('newEndDate').isISO8601().withMessage('Valid new end date is required'),
  body('newDuration').isNumeric().isInt({ min: 1 }).withMessage('Valid duration is required')
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

    // Only landlords can renew agreements
    if (req.user.role !== 'landlord') {
      return res.status(403).json({
        success: false,
        message: 'Only landlords can renew agreements'
      });
    }

    const { agreementId } = req.params;
    const { newEndDate, newDuration, newRent, newTerms } = req.body;
    const landlordId = req.user.id;

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

    if (agreement.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active agreements can be renewed'
      });
    }

    // Create new agreement with updated terms
    const renewedAgreementData = {
      property: agreement.property,
      landlord: agreement.landlord,
      tenant: agreement.tenant,
      terms: {
        ...agreement.terms,
        startDate: agreement.terms.endDate,
        endDate: new Date(newEndDate),
        duration: newDuration,
        monthlyRent: newRent || agreement.terms.monthlyRent,
        ...newTerms
      },
      clauses: agreement.clauses,
      renewal: {
        isRenewed: true,
        originalAgreement: agreement._id
      }
    };

    const renewedAgreement = await Agreement.create(renewedAgreementData);

    // Update original agreement
    agreement.renewal = {
      isRenewed: true,
      renewedAgreement: renewedAgreement._id
    };
    agreement.status = 'renewed';

    await agreement.save();

    res.status(201).json({
      success: true,
      message: 'Agreement renewed successfully',
      data: {
        originalAgreement: agreement,
        renewedAgreement
      }
    });

  } catch (error) {
    console.error('Renew agreement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get agreement blockchain status
// @route   GET /api/agreement/:agreementId/blockchain
// @access  Private
router.get('/:agreementId/blockchain', protect, async (req, res) => {
  try {
    const { agreementId } = req.params;
    const userId = req.user.id;

    // Build query based on user role
    const query = { _id: agreementId };
    if (req.user.role === 'tenant') {
      query.tenant = userId;
    } else if (req.user.role === 'landlord') {
      query.landlord = userId;
    }

    const agreement = await Agreement.findOne(query);

    if (!agreement) {
      return res.status(404).json({
        success: false,
        message: 'Agreement not found'
      });
    }

    res.json({
      success: true,
      data: {
        blockchainData: agreement.blockchain,
        isOnBlockchain: agreement.blockchain.isOnBlockchain,
        agreementHash: agreement.blockchain.agreementHash,
        transactionHash: agreement.blockchain.transactionHash
      }
    });

  } catch (error) {
    console.error('Get blockchain status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;