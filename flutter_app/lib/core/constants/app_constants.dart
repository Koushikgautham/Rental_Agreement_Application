class AppConstants {
  // App Information
  static const String appName = 'Rental Management';
  static const String appVersion = '1.0.0';
  static const String appDescription = 'A comprehensive rental management application for Indian landlords and tenants';
  
  // API Configuration
  static const String baseUrl = 'https://jsonplaceholder.typicode.com'; // Mock API for testing
  static const String apiVersion = 'v1';
  
  // User Roles
  static const String landlordRole = 'landlord';
  static const String tenantRole = 'tenant';
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userDataKey = 'user_data';
  static const String themeKey = 'theme_mode';
  static const String languageKey = 'language_code';
  static const String onboardingKey = 'onboarding_completed';
  static const String biometricKey = 'biometric_enabled';
  
  // Payment Status
  static const String paymentPending = 'pending';
  static const String paymentCompleted = 'completed';
  static const String paymentFailed = 'failed';
  static const String paymentOverdue = 'overdue';
  
  // Agreement Status
  static const String agreementDraft = 'draft';
  static const String agreementActive = 'active';
  static const String agreementSigned = 'signed';
  static const String agreementTerminated = 'terminated';
  static const String agreementExpired = 'expired';
  
  // Maintenance Request Status
  static const String maintenancePending = 'pending';
  static const String maintenanceInProgress = 'in_progress';
  static const String maintenanceCompleted = 'completed';
  static const String maintenanceCancelled = 'cancelled';
  
  // Maintenance Priority
  static const String priorityLow = 'low';
  static const String priorityMedium = 'medium';
  static const String priorityHigh = 'high';
  static const String priorityUrgent = 'urgent';
  
  // Property Status
  static const String propertyAvailable = 'available';
  static const String propertyOccupied = 'occupied';
  static const String propertyMaintenance = 'maintenance';
  static const String propertyInactive = 'inactive';
  
  // File Upload Limits
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const int maxImagesPerProperty = 10;
  static const int maxDocumentsPerAgreement = 5;
  static const int maxMaintenanceImages = 5;
  
  // Supported File Types
  static const List<String> supportedImageTypes = [
    'jpg', 'jpeg', 'png', 'gif', 'webp'
  ];
  static const List<String> supportedDocumentTypes = [
    'pdf', 'doc', 'docx', 'txt'
  ];
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Timeout Values (in seconds)
  static const int connectionTimeout = 30;
  static const int receiveTimeout = 30;
  static const int sendTimeout = 30;
  
  // Retry Configuration
  static const int maxRetryAttempts = 3;
  static const int retryDelay = 2; // seconds
  
  // Currency
  static const String defaultCurrency = 'INR';
  static const String currencySymbol = '₹';
  
  // Date Formats
  static const String dateFormat = 'dd/MM/yyyy';
  static const String dateTimeFormat = 'dd/MM/yyyy HH:mm';
  static const String timeFormat = 'HH:mm';
  static const String monthYearFormat = 'MMMM yyyy';
  
  // Validation Constants
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int maxNameLength = 50;
  static const int maxDescriptionLength = 500;
  static const int maxAddressLength = 200;
  static const int minPhoneLength = 10;
  static const int maxPhoneLength = 15;
  
  // Rent Payment
  static const int gracePeriodDays = 5;
  static const double lateFeePercentage = 2.0;
  static const int paymentReminderDays = 3;
  
  // Notification Types
  static const String notificationPaymentDue = 'payment_due';
  static const String notificationPaymentReceived = 'payment_received';
  static const String notificationMaintenanceCreated = 'maintenance_created';
  static const String notificationMaintenanceUpdated = 'maintenance_updated';
  static const String notificationAgreementSigned = 'agreement_signed';
  static const String notificationAgreementExpiring = 'agreement_expiring';
  
  // Deep Link Routes
  static const String deepLinkPayment = '/payment';
  static const String deepLinkMaintenance = '/maintenance';
  static const String deepLinkAgreement = '/agreement';
  static const String deepLinkProperty = '/property';
  
  // Error Messages
  static const String genericErrorMessage = 'Something went wrong. Please try again.';
  static const String networkErrorMessage = 'Please check your internet connection.';
  static const String serverErrorMessage = 'Server error. Please try again later.';
  static const String unauthorizedErrorMessage = 'You are not authorized to perform this action.';
  static const String validationErrorMessage = 'Please check your input and try again.';
  
  // Success Messages
  static const String loginSuccessMessage = 'Login successful!';
  static const String registrationSuccessMessage = 'Registration successful!';
  static const String paymentSuccessMessage = 'Payment completed successfully!';
  static const String maintenanceCreatedMessage = 'Maintenance request created successfully!';
  static const String profileUpdatedMessage = 'Profile updated successfully!';
  
  // Features Flags
  static const bool enableBiometricAuth = true;
  static const bool enablePushNotifications = true;
  static const bool enableDarkMode = true;
  static const bool enableMultiLanguage = true;
  static const bool enableBlockchainVerification = true;
  static const bool enableAnalytics = true;
  
  // Social Login
  static const bool enableGoogleLogin = true;
  static const bool enableFacebookLogin = false;
  static const bool enableAppleLogin = true;
  
  // Payment Methods
  static const List<String> supportedPaymentMethods = [
    'upi',
    'net_banking',
    'card',
    'wallet',
    'emi'
  ];
  
  // UPI Apps
  static const List<String> supportedUpiApps = [
    'gpay',
    'phonepe',
    'paytm',
    'bhim',
    'amazonpay'
  ];
  
  // Bank Categories
  static const List<String> bankCategories = [
    'public_sector',
    'private_sector',
    'foreign',
    'co_operative',
    'regional_rural'
  ];
  
  // Property Types
  static const List<String> propertyTypes = [
    'apartment',
    'house',
    'villa',
    'studio',
    'room',
    'commercial',
    'office',
    'shop'
  ];
  
  // Amenities
  static const List<String> commonAmenities = [
    'parking',
    'elevator',
    'security',
    'power_backup',
    'water_supply',
    'internet',
    'gym',
    'swimming_pool',
    'garden',
    'playground',
    'club_house',
    'maintenance_staff'
  ];
  
  // Cities (Major Indian Cities)
  static const List<String> majorCities = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara'
  ];
  
  // Indian States
  static const List<String> indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep',
    'Andaman and Nicobar Islands'
  ];
}