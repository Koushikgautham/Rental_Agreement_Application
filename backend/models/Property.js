const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a property title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a property description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'studio', 'room', 'commercial', 'office'],
    required: [true, 'Please specify property type']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please provide street address']
    },
    area: {
      type: String,
      required: [true, 'Please provide area/locality']
    },
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      match: [/^\d{6}$/, 'Please provide a valid pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property must belong to a landlord']
  },
  currentTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Please provide monthly rent amount'],
    min: [0, 'Rent cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Please provide security deposit amount'],
    min: [0, 'Security deposit cannot be negative']
  },
  maintenanceCharges: {
    type: Number,
    default: 0,
    min: [0, 'Maintenance charges cannot be negative']
  },
  amenities: [{
    type: String,
    enum: [
      'parking', 'lift', 'security', 'gym', 'swimming_pool', 'garden', 
      'balcony', 'ac', 'furnished', 'semi_furnished', 'unfurnished',
      'wifi', 'power_backup', 'water_supply', 'servant_room', 'study_room'
    ]
  }],
  specifications: {
    area: {
      carpet: Number, // in sq ft
      builtup: Number, // in sq ft
      super: Number   // in sq ft
    },
    bedrooms: {
      type: Number,
      min: 0,
      max: 10
    },
    bathrooms: {
      type: Number,
      min: 0,
      max: 10
    },
    balconies: {
      type: Number,
      min: 0,
      max: 5
    },
    floor: {
      current: Number,
      total: Number
    },
    age: Number, // in years
    facing: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west']
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  documents: [{
    type: {
      type: String,
      enum: ['ownership', 'tax_receipt', 'noc', 'approved_plan', 'other']
    },
    url: String,
    name: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'draft'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  preferences: {
    tenantType: {
      type: String,
      enum: ['family', 'bachelor', 'company', 'any'],
      default: 'any'
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    foodHabits: {
      type: String,
      enum: ['veg', 'non-veg', 'any'],
      default: 'any'
    },
    pets: {
      type: Boolean,
      default: false
    }
  },
  // Rent cycle configuration
  rentCycle: {
    dueDate: {
      type: Number,
      min: 1,
      max: 31,
      default: 1 // 1st of every month
    },
    gracePeriod: {
      type: Number,
      default: 5 // 5 days grace period
    },
    lateFee: {
      type: Number,
      default: 0
    }
  },
  // Blockchain related
  blockchainData: {
    propertyHash: String,
    transactionHash: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
propertySchema.index({ landlord: 1 });
propertySchema.index({ currentTenant: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ 'address.city': 1, 'address.area': 1 });
propertySchema.index({ monthlyRent: 1 });
propertySchema.index({ type: 1 });

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.area}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

// Pre middleware to populate references
propertySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'landlord',
    select: 'name email phone'
  }).populate({
    path: 'currentTenant',
    select: 'name email phone'
  });
  next();
});

module.exports = mongoose.model('Property', propertySchema);