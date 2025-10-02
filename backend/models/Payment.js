const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Payment must be associated with a property']
  },
  agreement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agreement',
    required: [true, 'Payment must be associated with an agreement']
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must have a landlord']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must have a tenant']
  },
  
  // Payment Details
  paymentId: {
    type: String,
    unique: true,
    required: [true, 'Payment ID is required']
  },
  
  // Payment Type
  type: {
    type: String,
    enum: ['rent', 'security_deposit', 'maintenance', 'late_fee', 'penalty', 'refund'],
    required: [true, 'Payment type is required']
  },
  
  // Amount Details
  amount: {
    total: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    rent: {
      type: Number,
      default: 0
    },
    maintenance: {
      type: Number,
      default: 0
    },
    lateFee: {
      type: Number,
      default: 0
    },
    penalty: {
      type: Number,
      default: 0
    },
    taxes: {
      gst: {
        type: Number,
        default: 0
      },
      tds: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Period Information (for rent payments)
  period: {
    month: {
      type: Number,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      min: 2020
    },
    startDate: Date,
    endDate: Date
  },
  
  // Due and Payment Dates
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  paidDate: Date,
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'overdue'],
    default: 'pending'
  },
  
  // Payment Gateway Details
  gateway: {
    provider: {
      type: String,
      enum: ['razorpay', 'payu', 'cashfree', 'manual', 'bank_transfer'],
      default: 'razorpay'
    },
    gatewayPaymentId: String,
    gatewayOrderId: String,
    gatewaySignature: String,
    gatewayResponse: mongoose.Schema.Types.Mixed
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'bank_transfer', 'cash', 'cheque'],
    required: [true, 'Payment method is required']
  },
  
  // Receipt Information
  receipt: {
    receiptNumber: {
      type: String,
      unique: true
    },
    receiptUrl: String,
    generated: {
      type: Boolean,
      default: false
    },
    generatedAt: Date,
    emailSent: {
      type: Boolean,
      default: false
    },
    emailSentAt: Date
  },
  
  // Late Payment Information
  latePayment: {
    isLate: {
      type: Boolean,
      default: false
    },
    daysLate: {
      type: Number,
      default: 0
    },
    lateFeeApplied: {
      type: Number,
      default: 0
    }
  },
  
  // Manual Payment Details (for cash/cheque)
  manualPayment: {
    chequeNumber: String,
    bankName: String,
    chequeDate: Date,
    depositedDate: Date,
    notes: String
  },
  
  // Refund Information
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundDate: Date,
    refundReason: String,
    refundTransactionId: String
  },
  
  // Auto-debit Information
  autoDebit: {
    isAutoDebit: {
      type: Boolean,
      default: false
    },
    mandateId: String,
    nextDebitDate: Date
  },
  
  // Notifications
  notifications: {
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentAt: Date,
    overdueNoticeSent: {
      type: Boolean,
      default: false
    },
    overdueNoticeSentAt: Date,
    paymentConfirmationSent: {
      type: Boolean,
      default: false
    }
  },
  
  // Blockchain Integration
  blockchain: {
    paymentHash: String,
    transactionHash: String,
    blockNumber: String,
    isOnBlockchain: {
      type: Boolean,
      default: false
    },
    receiptHash: String
  },
  
  // Additional Notes
  notes: String,
  
  // Processing Information
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedAt: Date,
  
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
    oldStatus: String,
    newStatus: String
  }]
}, {
  timestamps: true
});

// Indexes for better performance
paymentSchema.index({ property: 1 });
paymentSchema.index({ agreement: 1 });
paymentSchema.index({ landlord: 1 });
paymentSchema.index({ tenant: 1 });
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ 'period.month': 1, 'period.year': 1 });
paymentSchema.index({ 'receipt.receiptNumber': 1 });

// Virtual for payment status display
paymentSchema.virtual('statusDisplay').get(function() {
  if (this.status === 'pending' && new Date() > this.dueDate) {
    return 'overdue';
  }
  return this.status;
});

// Virtual for payment delay
paymentSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'pending' && new Date() > this.dueDate) {
    const timeDiff = new Date().getTime() - this.dueDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  return 0;
});

// Pre-save middleware to generate payment ID and receipt number
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.paymentId) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentId = `PAY${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  
  if (this.isNew && !this.receipt.receiptNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Payment').countDocuments();
    this.receipt.receiptNumber = `RCP${year}${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate if payment is late
  if (this.status === 'completed' && this.paidDate && this.dueDate) {
    if (this.paidDate > this.dueDate) {
      this.latePayment.isLate = true;
      const timeDiff = this.paidDate.getTime() - this.dueDate.getTime();
      this.latePayment.daysLate = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
  }
  
  next();
});

// Pre middleware to populate references
paymentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'property',
    select: 'title address monthlyRent'
  }).populate({
    path: 'landlord',
    select: 'name email phone'
  }).populate({
    path: 'tenant',
    select: 'name email phone'
  });
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);