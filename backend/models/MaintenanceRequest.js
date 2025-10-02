const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Maintenance request must be associated with a property']
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Maintenance request must have a tenant']
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Maintenance request must have a landlord']
  },
  
  // Request Details
  requestNumber: {
    type: String,
    unique: true,
    required: [true, 'Request number is required']
  },
  
  title: {
    type: String,
    required: [true, 'Please provide a title for the maintenance request'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  
  category: {
    type: String,
    enum: [
      'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning',
      'appliance_repair', 'pest_control', 'security', 'garden',
      'hvac', 'roofing', 'flooring', 'door_window', 'other'
    ],
    required: [true, 'Please specify the maintenance category']
  },
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  
  location: {
    type: String,
    required: [true, 'Please specify the location within the property'],
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['open', 'acknowledged', 'in_progress', 'pending_approval', 'completed', 'cancelled', 'on_hold'],
    default: 'open'
  },
  
  // Images and Documentation
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    url: String,
    name: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    description: String
  }],
  
  // Service Provider Information
  serviceProvider: {
    assigned: {
      type: Boolean,
      default: false
    },
    name: String,
    phone: String,
    email: String,
    company: String,
    specialization: String,
    assignedAt: Date,
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Cost and Payment
  cost: {
    estimated: {
      type: Number,
      min: [0, 'Estimated cost cannot be negative']
    },
    actual: {
      type: Number,
      min: [0, 'Actual cost cannot be negative']
    },
    paidBy: {
      type: String,
      enum: ['tenant', 'landlord', 'shared'],
      default: 'landlord'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'disputed'],
      default: 'pending'
    },
    receipt: {
      url: String,
      uploadedAt: Date
    }
  },
  
  // Timeline
  timeline: {
    requestedAt: {
      type: Date,
      default: Date.now
    },
    acknowledgedAt: Date,
    startedAt: Date,
    completedAt: Date,
    expectedCompletionDate: Date
  },
  
  // Urgency and Availability
  urgency: {
    isUrgent: {
      type: Boolean,
      default: false
    },
    reason: String
  },
  
  availability: {
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'any_time']
    },
    tenantAvailable: {
      type: Boolean,
      default: true
    },
    accessInstructions: String,
    contactPerson: {
      name: String,
      phone: String
    }
  },
  
  // Work Details
  workDetails: {
    materialsRequired: [String],
    toolsRequired: [String],
    estimatedDuration: String, // e.g., "2 hours", "1 day"
    workDescription: String,
    safetyRequirements: [String]
  },
  
  // Completion Details
  completion: {
    workCompleted: String,
    materialsUsed: [{
      item: String,
      quantity: Number,
      cost: Number
    }],
    beforeImages: [String],
    afterImages: [String],
    tenantSatisfaction: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      feedback: String,
      submittedAt: Date
    },
    landlordApproval: {
      approved: {
        type: Boolean,
        default: false
      },
      approvedAt: Date,
      comments: String
    }
  },
  
  // Communication Log
  communications: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'status_update', 'cost_estimate', 'completion_notice'],
      default: 'message'
    },
    attachments: [String]
  }],
  
  // Recurring Maintenance
  recurring: {
    isRecurring: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'biannual', 'annual']
    },
    nextDueDate: Date,
    parentRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRequest'
    }
  },
  
  // Emergency Contact
  emergency: {
    isEmergency: {
      type: Boolean,
      default: false
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    },
    emergencyActions: [String]
  },
  
  // Quality Assurance
  qualityCheck: {
    inspectionRequired: {
      type: Boolean,
      default: false
    },
    inspectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    inspectionDate: Date,
    inspectionNotes: String,
    passed: {
      type: Boolean,
      default: false
    }
  },
  
  // Notes and Comments
  notes: String,
  internalNotes: String, // Only visible to landlord
  
  // Cancellation
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
maintenanceRequestSchema.index({ property: 1 });
maintenanceRequestSchema.index({ tenant: 1 });
maintenanceRequestSchema.index({ landlord: 1 });
maintenanceRequestSchema.index({ requestNumber: 1 });
maintenanceRequestSchema.index({ status: 1 });
maintenanceRequestSchema.index({ category: 1 });
maintenanceRequestSchema.index({ priority: 1 });
maintenanceRequestSchema.index({ 'timeline.requestedAt': 1 });

// Virtual for request age
maintenanceRequestSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const requested = this.timeline.requestedAt;
  const timeDiff = now.getTime() - requested.getTime();
  return Math.floor(timeDiff / (1000 * 3600 * 24));
});

// Virtual for estimated completion status
maintenanceRequestSchema.virtual('isOverdue').get(function() {
  if (this.timeline.expectedCompletionDate && this.status !== 'completed') {
    return new Date() > this.timeline.expectedCompletionDate;
  }
  return false;
});

// Pre-save middleware to generate request number
maintenanceRequestSchema.pre('save', async function(next) {
  if (this.isNew && !this.requestNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('MaintenanceRequest').countDocuments();
    this.requestNumber = `MNT${year}${month}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Pre middleware to populate references
maintenanceRequestSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'property',
    select: 'title address'
  }).populate({
    path: 'tenant',
    select: 'name email phone'
  }).populate({
    path: 'landlord',
    select: 'name email phone'
  });
  next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);