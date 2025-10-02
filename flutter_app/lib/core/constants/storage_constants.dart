import '../constants/app_constants.dart';

class StorageConstants {
  // Authentication Keys
  static const String authToken = AppConstants.authTokenKey;
  static const String refreshToken = AppConstants.refreshTokenKey;
  static const String userData = AppConstants.userDataKey;
  static const String isLoggedIn = 'is_logged_in';
  static const String loginTimestamp = 'login_timestamp';
  static const String tokenExpiryTime = 'token_expiry_time';
  
  // User Preferences
  static const String themeMode = AppConstants.themeKey;
  static const String languageCode = AppConstants.languageKey;
  static const String onboardingCompleted = AppConstants.onboardingKey;
  static const String biometricEnabled = AppConstants.biometricKey;
  static const String notificationsEnabled = 'notifications_enabled';
  static const String pushNotificationsEnabled = 'push_notifications_enabled';
  static const String emailNotificationsEnabled = 'email_notifications_enabled';
  static const String smsNotificationsEnabled = 'sms_notifications_enabled';
  
  // App Settings
  static const String autoLoginEnabled = 'auto_login_enabled';
  static const String rememberMe = 'remember_me';
  static const String firstLaunch = 'first_launch';
  static const String appVersion = 'app_version';
  static const String buildNumber = 'build_number';
  static const String lastUpdateCheck = 'last_update_check';
  
  // Device Information
  static const String deviceId = 'device_id';
  static const String fcmToken = 'fcm_token';
  static const String deviceInfo = 'device_info';
  static const String installationId = 'installation_id';
  
  // User Profile
  static const String userRole = 'user_role';
  static const String userId = 'user_id';
  static const String userEmail = 'user_email';
  static const String userPhone = 'user_phone';
  static const String userName = 'user_name';
  static const String userAvatar = 'user_avatar';
  static const String userVerificationStatus = 'user_verification_status';
  
  // Dashboard Data
  static const String dashboardData = 'dashboard_data';
  static const String dashboardLastUpdated = 'dashboard_last_updated';
  static const String recentActivities = 'recent_activities';
  static const String quickStats = 'quick_stats';
  
  // Property Data
  static const String propertiesCache = 'properties_cache';
  static const String propertyFilters = 'property_filters';
  static const String favoriteProperties = 'favorite_properties';
  static const String recentlyViewedProperties = 'recently_viewed_properties';
  static const String propertySearchHistory = 'property_search_history';
  
  // Payment Data
  static const String paymentHistory = 'payment_history';
  static const String pendingPayments = 'pending_payments';
  static const String savedPaymentMethods = 'saved_payment_methods';
  static const String paymentPreferences = 'payment_preferences';
  static const String autoPayEnabled = 'auto_pay_enabled';
  static const String paymentReminders = 'payment_reminders';
  
  // Agreement Data
  static const String agreementsCache = 'agreements_cache';
  static const String agreementTemplates = 'agreement_templates';
  static const String signedAgreements = 'signed_agreements';
  static const String draftAgreements = 'draft_agreements';
  
  // Maintenance Data
  static const String maintenanceRequests = 'maintenance_requests';
  static const String maintenanceCategories = 'maintenance_categories';
  static const String maintenanceHistory = 'maintenance_history';
  static const String maintenancePreferences = 'maintenance_preferences';
  
  // Notification Data
  static const String notifications = 'notifications';
  static const String unreadNotificationCount = 'unread_notification_count';
  static const String notificationSettings = 'notification_settings';
  static const String lastNotificationCheck = 'last_notification_check';
  
  // Location Data
  static const String currentLocation = 'current_location';
  static const String savedLocations = 'saved_locations';
  static const String recentSearches = 'recent_searches';
  static const String locationPermissionAsked = 'location_permission_asked';
  
  // Analytics Data
  static const String analyticsData = 'analytics_data';
  static const String usageStatistics = 'usage_statistics';
  static const String performanceMetrics = 'performance_metrics';
  
  // Security
  static const String lastPasswordChange = 'last_password_change';
  static const String securityQuestions = 'security_questions';
  static const String loginAttempts = 'login_attempts';
  static const String accountLocked = 'account_locked';
  static const String lockoutTime = 'lockout_time';
  
  // File Management
  static const String downloadedFiles = 'downloaded_files';
  static const String uploadQueue = 'upload_queue';
  static const String cachedImages = 'cached_images';
  static const String documentsCache = 'documents_cache';
  
  // Sync Data
  static const String lastSyncTime = 'last_sync_time';
  static const String syncQueue = 'sync_queue';
  static const String offlineChanges = 'offline_changes';
  static const String syncEnabled = 'sync_enabled';
  
  // Form Data (for persistence)
  static const String propertyFormDraft = 'property_form_draft';
  static const String agreementFormDraft = 'agreement_form_draft';
  static const String maintenanceFormDraft = 'maintenance_form_draft';
  static const String profileFormDraft = 'profile_form_draft';
  
  // Search and Filters
  static const String searchFilters = 'search_filters';
  static const String sortPreferences = 'sort_preferences';
  static const String viewPreferences = 'view_preferences';
  
  // Tutorial and Help
  static const String tutorialCompleted = 'tutorial_completed';
  static const String helpSeen = 'help_seen';
  static const String featureIntroShown = 'feature_intro_shown';
  static const String tooltipsEnabled = 'tooltips_enabled';
  
  // Emergency Contacts
  static const String emergencyContacts = 'emergency_contacts';
  static const String supportContactInfo = 'support_contact_info';
  
  // App Performance
  static const String crashReports = 'crash_reports';
  static const String errorLogs = 'error_logs';
  static const String performanceLogs = 'performance_logs';
  
  // Feature Flags
  static const String enabledFeatures = 'enabled_features';
  static const String betaFeatures = 'beta_features';
  static const String experimentalFeatures = 'experimental_features';
  
  // Blockchain Data
  static const String blockchainAddress = 'blockchain_address';
  static const String blockchainPrivateKey = 'blockchain_private_key';
  static const String transactionHistory = 'transaction_history';
  static const String escrowContracts = 'escrow_contracts';
  
  // Backup and Restore
  static const String backupData = 'backup_data';
  static const String lastBackupTime = 'last_backup_time';
  static const String autoBackupEnabled = 'auto_backup_enabled';
  static const String restoreInProgress = 'restore_in_progress';
  
  // Debug and Development
  static const String debugMode = 'debug_mode';
  static const String testMode = 'test_mode';
  static const String mockDataEnabled = 'mock_data_enabled';
  static const String logLevel = 'log_level';
  
  // Migration Data
  static const String dataVersion = 'data_version';
  static const String migrationRequired = 'migration_required';
  static const String lastMigrationTime = 'last_migration_time';
  
  // Calendar and Scheduling
  static const String calendarEvents = 'calendar_events';
  static const String reminderSettings = 'reminder_settings';
  static const String appointmentHistory = 'appointment_history';
  
  // Communication
  static const String chatHistory = 'chat_history';
  static const String messageTemplates = 'message_templates';
  static const String communicationPreferences = 'communication_preferences';
  
  // Ratings and Reviews
  static const String userRatings = 'user_ratings';
  static const String reviewsGiven = 'reviews_given';
  static const String reviewsReceived = 'reviews_received';
  
  // Social Features
  static const String socialConnections = 'social_connections';
  static const String referralCodes = 'referral_codes';
  static const String invitationsSent = 'invitations_sent';
  
  // Compliance and Legal
  static const String termsAccepted = 'terms_accepted';
  static const String privacyPolicyAccepted = 'privacy_policy_accepted';
  static const String cookieConsent = 'cookie_consent';
  static const String dataProcessingConsent = 'data_processing_consent';
  
  // Storage Boxes (for Hive)
  static const String userBox = 'user_box';
  static const String propertiesBox = 'properties_box';
  static const String paymentsBox = 'payments_box';
  static const String agreementsBox = 'agreements_box';
  static const String maintenanceBox = 'maintenance_box';
  static const String notificationsBox = 'notifications_box';
  static const String settingsBox = 'settings_box';
  static const String cacheBox = 'cache_box';
}