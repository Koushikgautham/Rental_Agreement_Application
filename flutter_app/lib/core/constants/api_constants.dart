import '../constants/app_constants.dart';

class ApiConstants {
  // Base Configuration
  static const String baseUrl = AppConstants.baseUrl;
  static const String apiVersion = AppConstants.apiVersion;
  
  // Authentication Endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyOtp = '/auth/verify-otp';
  static const String resendOtp = '/auth/resend-otp';
  static const String changePassword = '/auth/change-password';
  
  // User Endpoints
  static const String profile = '/users/profile';
  static const String updateProfile = '/users/profile';
  static const String uploadAvatar = '/users/avatar';
  static const String deleteAccount = '/users/delete';
  static const String verifyEmail = '/users/verify-email';
  static const String verifyPhone = '/users/verify-phone';
  
  // Property Endpoints
  static const String properties = '/properties';
  static const String createProperty = '/properties';
  static const String updateProperty = '/properties'; // + /:id
  static const String deleteProperty = '/properties'; // + /:id
  static const String propertyDetails = '/properties'; // + /:id
  static const String propertyImages = '/properties'; // + /:id/images
  static const String uploadPropertyImage = '/properties'; // + /:id/images
  static const String deletePropertyImage = '/properties'; // + /:id/images/:imageId
  static const String nearbyProperties = '/properties/nearby';
  static const String searchProperties = '/properties/search';
  
  // Tenant Management (Landlord)
  static const String tenants = '/landlord/tenants';
  static const String tenantDetails = '/landlord/tenants'; // + /:id
  static const String inviteTenant = '/landlord/tenants/invite';
  static const String removeTenant = '/landlord/tenants'; // + /:id/remove
  static const String tenantAgreements = '/landlord/tenants'; // + /:id/agreements
  static const String tenantPayments = '/landlord/tenants'; // + /:id/payments
  
  // Agreement Endpoints
  static const String agreements = '/agreements';
  static const String createAgreement = '/agreements';
  static const String updateAgreement = '/agreements'; // + /:id
  static const String deleteAgreement = '/agreements'; // + /:id
  static const String agreementDetails = '/agreements'; // + /:id
  static const String signAgreement = '/agreements'; // + /:id/sign
  static const String terminateAgreement = '/agreements'; // + /:id/terminate
  static const String renewAgreement = '/agreements'; // + /:id/renew
  static const String agreementDocuments = '/agreements'; // + /:id/documents
  static const String uploadAgreementDocument = '/agreements'; // + /:id/documents
  static const String downloadAgreement = '/agreements'; // + /:id/download
  
  // Payment Endpoints
  static const String payments = '/payments';
  static const String createPaymentOrder = '/payments/create-order';
  static const String verifyPayment = '/payments/verify';
  static const String paymentHistory = '/payments/history';
  static const String pendingPayments = '/payments/pending';
  static const String overduePayments = '/payments/overdue';
  static const String paymentReceipt = '/payments'; // + /:id/receipt
  static const String downloadReceipt = '/payments'; // + /:id/receipt/download
  static const String paymentMethods = '/payments/methods';
  static const String savePaymentMethod = '/payments/methods';
  static const String paymentAnalytics = '/payments/analytics';
  
  // Maintenance Endpoints
  static const String maintenanceRequests = '/maintenance';
  static const String createMaintenanceRequest = '/maintenance';
  static const String updateMaintenanceRequest = '/maintenance'; // + /:id
  static const String deleteMaintenanceRequest = '/maintenance'; // + /:id
  static const String maintenanceDetails = '/maintenance'; // + /:id
  static const String assignMaintenance = '/maintenance'; // + /:id/assign
  static const String updateMaintenanceStatus = '/maintenance'; // + /:id/status
  static const String maintenanceImages = '/maintenance'; // + /:id/images
  static const String uploadMaintenanceImage = '/maintenance'; // + /:id/images
  static const String rateMaintenance = '/maintenance'; // + /:id/rate
  static const String maintenanceCategories = '/maintenance/categories';
  
  // Blockchain Endpoints
  static const String blockchainVerify = '/blockchain/verify';
  static const String storeAgreementHash = '/blockchain/agreement-hash';
  static const String storePaymentHash = '/blockchain/payment-hash';
  static const String createEscrow = '/blockchain/escrow/create';
  static const String releaseEscrow = '/blockchain/escrow/release';
  static const String getTransactionStatus = '/blockchain/transaction'; // + /:hash
  static const String getBlockchainRecord = '/blockchain/record'; // + /:id
  
  // Notification Endpoints
  static const String notifications = '/notifications';
  static const String markNotificationRead = '/notifications'; // + /:id/read
  static const String markAllRead = '/notifications/mark-all-read';
  static const String notificationSettings = '/notifications/settings';
  static const String updateNotificationSettings = '/notifications/settings';
  static const String deviceToken = '/notifications/device-token';
  
  // Analytics Endpoints (Landlord)
  static const String dashboardAnalytics = '/analytics/dashboard';
  static const String revenueAnalytics = '/analytics/revenue';
  static const String occupancyAnalytics = '/analytics/occupancy';
  static const String paymentAnalytics2 = '/analytics/payments';
  static const String maintenanceAnalytics = '/analytics/maintenance';
  static const String tenantAnalytics = '/analytics/tenants';
  static const String propertyAnalytics = '/analytics/properties';
  
  // File Upload Endpoints
  static const String uploadFile = '/upload/file';
  static const String uploadImage = '/upload/image';
  static const String uploadDocument = '/upload/document';
  static const String deleteFile = '/upload/delete'; // + /:fileId
  static const String getFileUrl = '/upload/url'; // + /:fileId
  
  // Location Endpoints
  static const String searchCities = '/location/cities';
  static const String searchAreas = '/location/areas';
  static const String getNearbyAmenities = '/location/amenities/nearby';
  static const String getLocationDetails = '/location/details';
  
  // Support Endpoints
  static const String supportTickets = '/support/tickets';
  static const String createSupportTicket = '/support/tickets';
  static const String supportTicketDetails = '/support/tickets'; // + /:id
  static const String updateSupportTicket = '/support/tickets'; // + /:id
  static const String supportCategories = '/support/categories';
  static const String faq = '/support/faq';
  
  // Admin Endpoints (if needed)
  static const String adminUsers = '/admin/users';
  static const String adminProperties = '/admin/properties';
  static const String adminPayments = '/admin/payments';
  static const String adminMaintenance = '/admin/maintenance';
  static const String adminAnalytics = '/admin/analytics';
  static const String adminSettings = '/admin/settings';
  
  // Health Check
  static const String healthCheck = '/health';
  static const String version = '/version';
  
  // Utility Methods
  static String propertyById(String id) => '$properties/$id';
  static String updatePropertyById(String id) => '$updateProperty/$id';
  static String deletePropertyById(String id) => '$deleteProperty/$id';
  static String propertyImagesById(String id) => '$propertyImages/$id/images';
  static String uploadPropertyImageById(String id) => '$uploadPropertyImage/$id/images';
  static String deletePropertyImageById(String id, String imageId) => 
      '$deletePropertyImage/$id/images/$imageId';
  
  static String agreementById(String id) => '$agreements/$id';
  static String updateAgreementById(String id) => '$updateAgreement/$id';
  static String deleteAgreementById(String id) => '$deleteAgreement/$id';
  static String signAgreementById(String id) => '$signAgreement/$id/sign';
  static String terminateAgreementById(String id) => '$terminateAgreement/$id/terminate';
  static String renewAgreementById(String id) => '$renewAgreement/$id/renew';
  static String agreementDocumentsById(String id) => '$agreementDocuments/$id/documents';
  static String uploadAgreementDocumentById(String id) => '$uploadAgreementDocument/$id/documents';
  static String downloadAgreementById(String id) => '$downloadAgreement/$id/download';
  
  static String paymentReceiptById(String id) => '$paymentReceipt/$id/receipt';
  static String downloadReceiptById(String id) => '$downloadReceipt/$id/receipt/download';
  
  static String maintenanceById(String id) => '$maintenanceRequests/$id';
  static String updateMaintenanceById(String id) => '$updateMaintenanceRequest/$id';
  static String deleteMaintenanceById(String id) => '$deleteMaintenanceRequest/$id';
  static String assignMaintenanceById(String id) => '$assignMaintenance/$id/assign';
  static String updateMaintenanceStatusById(String id) => '$updateMaintenanceStatus/$id/status';
  static String maintenanceImagesById(String id) => '$maintenanceImages/$id/images';
  static String uploadMaintenanceImageById(String id) => '$uploadMaintenanceImage/$id/images';
  static String rateMaintenanceById(String id) => '$rateMaintenance/$id/rate';
  
  static String tenantById(String id) => '$tenants/$id';
  static String removeTenantById(String id) => '$removeTenant/$id/remove';
  static String tenantAgreementsById(String id) => '$tenantAgreements/$id/agreements';
  static String tenantPaymentsById(String id) => '$tenantPayments/$id/payments';
  
  static String markNotificationReadById(String id) => '$markNotificationRead/$id/read';
  static String getTransactionStatusByHash(String hash) => '$getTransactionStatus/$hash';
  static String getBlockchainRecordById(String id) => '$getBlockchainRecord/$id';
  
  static String deleteFileById(String fileId) => '$deleteFile/$fileId';
  static String getFileUrlById(String fileId) => '$getFileUrl/$fileId';
  
  static String supportTicketById(String id) => '$supportTickets/$id';
  static String updateSupportTicketById(String id) => '$updateSupportTicket/$id';
}