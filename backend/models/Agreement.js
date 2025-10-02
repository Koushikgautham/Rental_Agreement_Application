const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Agreement must be associated with a property']
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agreement must have a landlord']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agreement must have a tenant']
  },
  agreementNumber: {
    type: String,
    unique: true,
    required: [true, 'Agreement number is required']
  },
  
  // Agreement Terms
  terms: {
    monthlyRent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [0, 'Rent cannot be negative']
    },
    securityDeposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Security deposit cannot be negative']
    },
    maintenanceCharges: {
      type: Number,
      default: 0,
      min: [0, 'Maintenance charges cannot be negative']
    },
    startDate: {
      type: Date,
      required: [true, 'Agreement start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'Agreement end date is required']
    },
    duration: {
      type: Number, // in months
      required: [true, 'Agreement duration is required']
    },
    rentDueDate: {
      type: Number,
      min: 1,
      max: 31,
      default: 1 // 1st of every month
    },
    gracePeriod: {
      type: Number,
      default: 5 // 5 days
    },
    lateFee: {
      type: Number,
      default: 0
    },
    rentIncrement: {
      percentage: {
        type: Number,
        default: 0
      },
      frequency: {
        type: String,
        enum: ['yearly', 'biannual', 'none'],
        default: 'none'
      }
    }
  },

  // Agreement Clauses
  clauses: {
    noticePeriod: {
      type: Number,
      default: 30 // days
    },
    allowedOccupants: {
      type: Number,
      default: 1
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    sublettingAllowed: {
      type: Boolean,
      default: false
    },
    modifications: {
      type: String,
      default: 'Not allowed without written permission'
    },
    utilities: {
      electricity: {
        type: String,
        enum: ['included', 'separate', 'shared'],
        default: 'separate'
      },
      water: {
        type: String,
        enum: ['included', 'separate', 'shared'],
        default: 'included'
      },
      gas: {
        type: String,
        enum: ['included', 'separate', 'shared'],
        default: 'separate'
      },
      internet: {
        type: String,
        enum: ['included', 'separate', 'shared'],
        default: 'separate'
      }
    },
    parking: {
      type: String,
      default: 'As per property amenities'
    },
    maintenanceResponsibility: {
      tenant: [String], // Array of maintenance items tenant is responsible for
      landlord: [String] // Array of maintenance items landlord is responsible for
    }
  },

  // Document Management
  documents: {
    originalFile: {
      url: String,
      name: String,
      size: Number,
      uploadDate: {
        type: Date,
        default: Date.now
      }
    },
    signedFile: {
      url: String,
      name: String,
      size: Number,
      uploadDate: Date
    },
    amendments: [{
      file: {
        url: String,
        name: String,
        uploadDate: {
          type: Date,
          default: Date.now
        }
      },
      description: String,
      effectiveDate: Date
    }]
  },

  // Digital Signatures
  signatures: {
    landlord: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      signatureHash: String,
      ipAddress: String
    },
    tenant: {
      signed: {
        type: Boolean,
        default: false
      },
      signedAt: Date,
      signatureHash: String,
      ipAddress: String
    }
  },

  // Witnesses
  witnesses: [{
    name: String,
    phone: String,
    email: String,
    address: String,
    signed: {
      type: Boolean,
      default: false
    },
    signedAt: Date
  }],

  // Status Management
  status: {
    type: String,
    enum: ['draft', 'pending_signatures', 'active', 'expired', 'terminated', 'renewed'],
    default: 'draft'
  },

  // Renewal Information
  renewal: {
    isRenewed: {
      type: Boolean,
      default: false
    },
    renewedAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement'
    },
    originalAgreement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement'
    }
  },

  // Termination Information
  termination: {
    isTerminated: {
      type: Boolean,
      default: false
    },
    terminationDate: Date,
    terminationReason: String,
    terminatedBy: {
      type: String,
      enum: ['landlord', 'tenant', 'mutual']
    },
    noticePeriodServed: {
      type: Boolean,
      default: false
    },
    depositStatus: {
      type: String,
      enum: ['pending', 'refunded', 'forfeited', 'partially_refunded'],
      default: 'pending'
    },
    refundAmount: Number,
    refundDate: Date
  },

  // Blockchain Integration
  blockchain: {
    agreementHash: String,
    transactionHash: String,
    blockNumber: String,
    isOnBlockchain: {
      type: Boolean,
      default: false
    },
    smartContractAddress: String
  },

  // Audit Trail
  auditTrail: [{
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    ipAddress: String
  }]
}, {
  timestamps: true
});

// Indexes
agreementSchema.index({ property: 1 });
agreementSchema.index({ landlord: 1 });
agreementSchema.index({ tenant: 1 });
agreementSchema.index({ agreementNumber: 1 });
agreementSchema.index({ status: 1 });
agreementSchema.index({ 'terms.startDate': 1, 'terms.endDate': 1 });

// Virtual for agreement validity
agreementSchema.virtual('isValid').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         this.terms.startDate <= now && 
         this.terms.endDate >= now;
});

// Virtual for remaining days
agreementSchema.virtual('remainingDays').get(function() {
  const now = new Date();
  const endDate = new Date(this.terms.endDate);
  const timeDiff = endDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Pre-save middleware to generate agreement number
agreementSchema.pre('save', async function(next) {
  if (this.isNew && !this.agreementNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Agreement').countDocuments();
    this.agreementNumber = `AGR${year}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre middleware to populate references
agreementSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'property',
    select: 'title address type'
  }).populate({
    path: 'landlord',
    select: 'name email phone'
  }).populate({
    path: 'tenant',
    select: 'name email phone'
  });
  next();
});

module.exports = mongoose.model('Agreement', agreementSchema);