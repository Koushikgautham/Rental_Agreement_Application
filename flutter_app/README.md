# Flutter Rental Management App

## Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── app.dart                     # Main app configuration
│   ├── config/                      # App configuration
│   │   ├── app_config.dart
│   │   ├── routes.dart
│   │   └── theme.dart
│   ├── core/                        # Core functionality
│   │   ├── constants/
│   │   │   ├── api_constants.dart
│   │   │   ├── app_constants.dart
│   │   │   └── storage_constants.dart
│   │   ├── errors/
│   │   │   ├── exceptions.dart
│   │   │   └── failures.dart
│   │   ├── network/
│   │   │   ├── api_client.dart
│   │   │   ├── network_info.dart
│   │   │   └── interceptors.dart
│   │   ├── storage/
│   │   │   ├── local_storage.dart
│   │   │   └── secure_storage.dart
│   │   └── utils/
│   │       ├── date_utils.dart
│   │       ├── validators.dart
│   │       ├── formatters.dart
│   │       └── extensions.dart
│   ├── data/                        # Data layer
│   │   ├── datasources/
│   │   │   ├── local/
│   │   │   │   ├── auth_local_datasource.dart
│   │   │   │   ├── property_local_datasource.dart
│   │   │   │   └── payment_local_datasource.dart
│   │   │   └── remote/
│   │   │       ├── auth_remote_datasource.dart
│   │   │       ├── property_remote_datasource.dart
│   │   │       ├── payment_remote_datasource.dart
│   │   │       ├── agreement_remote_datasource.dart
│   │   │       ├── maintenance_remote_datasource.dart
│   │   │       └── blockchain_remote_datasource.dart
│   │   ├── models/
│   │   │   ├── user_model.dart
│   │   │   ├── property_model.dart
│   │   │   ├── agreement_model.dart
│   │   │   ├── payment_model.dart
│   │   │   ├── maintenance_model.dart
│   │   │   └── blockchain_model.dart
│   │   └── repositories/
│   │       ├── auth_repository_impl.dart
│   │       ├── property_repository_impl.dart
│   │       ├── payment_repository_impl.dart
│   │       ├── agreement_repository_impl.dart
│   │       ├── maintenance_repository_impl.dart
│   │       └── blockchain_repository_impl.dart
│   ├── domain/                      # Domain layer
│   │   ├── entities/
│   │   │   ├── user.dart
│   │   │   ├── property.dart
│   │   │   ├── agreement.dart
│   │   │   ├── payment.dart
│   │   │   ├── maintenance_request.dart
│   │   │   └── blockchain_record.dart
│   │   ├── repositories/
│   │   │   ├── auth_repository.dart
│   │   │   ├── property_repository.dart
│   │   │   ├── payment_repository.dart
│   │   │   ├── agreement_repository.dart
│   │   │   ├── maintenance_repository.dart
│   │   │   └── blockchain_repository.dart
│   │   └── usecases/
│   │       ├── auth/
│   │       │   ├── login_usecase.dart
│   │       │   ├── register_usecase.dart
│   │       │   ├── logout_usecase.dart
│   │       │   └── get_current_user_usecase.dart
│   │       ├── property/
│   │       │   ├── get_properties_usecase.dart
│   │       │   ├── create_property_usecase.dart
│   │       │   ├── update_property_usecase.dart
│   │       │   └── delete_property_usecase.dart
│   │       ├── payment/
│   │       │   ├── create_payment_order_usecase.dart
│   │       │   ├── verify_payment_usecase.dart
│   │       │   ├── get_payment_history_usecase.dart
│   │       │   └── get_pending_payments_usecase.dart
│   │       ├── agreement/
│   │       │   ├── create_agreement_usecase.dart
│   │       │   ├── sign_agreement_usecase.dart
│   │       │   ├── get_agreements_usecase.dart
│   │       │   └── terminate_agreement_usecase.dart
│   │       ├── maintenance/
│   │       │   ├── create_maintenance_request_usecase.dart
│   │       │   ├── get_maintenance_requests_usecase.dart
│   │       │   ├── update_maintenance_request_usecase.dart
│   │       │   └── rate_maintenance_usecase.dart
│   │       └── blockchain/
│   │           ├── store_agreement_hash_usecase.dart
│   │           ├── store_payment_hash_usecase.dart
│   │           ├── create_escrow_usecase.dart
│   │           └── verify_document_usecase.dart
│   ├── presentation/                # Presentation layer
│   │   ├── blocs/                   # State management (BLoC)
│   │   │   ├── auth/
│   │   │   │   ├── auth_bloc.dart
│   │   │   │   ├── auth_event.dart
│   │   │   │   └── auth_state.dart
│   │   │   ├── property/
│   │   │   │   ├── property_bloc.dart
│   │   │   │   ├── property_event.dart
│   │   │   │   └── property_state.dart
│   │   │   ├── payment/
│   │   │   │   ├── payment_bloc.dart
│   │   │   │   ├── payment_event.dart
│   │   │   │   └── payment_state.dart
│   │   │   ├── agreement/
│   │   │   │   ├── agreement_bloc.dart
│   │   │   │   ├── agreement_event.dart
│   │   │   │   └── agreement_state.dart
│   │   │   ├── maintenance/
│   │   │   │   ├── maintenance_bloc.dart
│   │   │   │   ├── maintenance_event.dart
│   │   │   │   └── maintenance_state.dart
│   │   │   └── blockchain/
│   │   │       ├── blockchain_bloc.dart
│   │   │       ├── blockchain_event.dart
│   │   │       └── blockchain_state.dart
│   │   ├── pages/                   # UI Pages
│   │   │   ├── splash/
│   │   │   │   └── splash_page.dart
│   │   │   ├── onboarding/
│   │   │   │   └── onboarding_page.dart
│   │   │   ├── auth/
│   │   │   │   ├── login_page.dart
│   │   │   │   ├── register_page.dart
│   │   │   │   └── forgot_password_page.dart
│   │   │   ├── tenant/
│   │   │   │   ├── tenant_dashboard_page.dart
│   │   │   │   ├── rent_calendar_page.dart
│   │   │   │   ├── payment_history_page.dart
│   │   │   │   ├── payment_page.dart
│   │   │   │   ├── agreement_page.dart
│   │   │   │   ├── maintenance_list_page.dart
│   │   │   │   ├── create_maintenance_page.dart
│   │   │   │   └── profile_page.dart
│   │   │   ├── landlord/
│   │   │   │   ├── landlord_dashboard_page.dart
│   │   │   │   ├── properties_page.dart
│   │   │   │   ├── create_property_page.dart
│   │   │   │   ├── property_details_page.dart
│   │   │   │   ├── tenants_page.dart
│   │   │   │   ├── tenant_details_page.dart
│   │   │   │   ├── agreements_page.dart
│   │   │   │   ├── create_agreement_page.dart
│   │   │   │   ├── payments_page.dart
│   │   │   │   ├── maintenance_page.dart
│   │   │   │   ├── analytics_page.dart
│   │   │   │   └── profile_page.dart
│   │   │   ├── shared/
│   │   │   │   ├── payment_receipt_page.dart
│   │   │   │   ├── maintenance_details_page.dart
│   │   │   │   ├── agreement_details_page.dart
│   │   │   │   ├── document_viewer_page.dart
│   │   │   │   └── settings_page.dart
│   │   │   └── common/
│   │   │       ├── error_page.dart
│   │   │       └── no_internet_page.dart
│   │   ├── widgets/                 # Reusable widgets
│   │   │   ├── common/
│   │   │   │   ├── custom_app_bar.dart
│   │   │   │   ├── custom_button.dart
│   │   │   │   ├── custom_text_field.dart
│   │   │   │   ├── loading_widget.dart
│   │   │   │   ├── error_widget.dart
│   │   │   │   ├── empty_widget.dart
│   │   │   │   ├── custom_card.dart
│   │   │   │   ├── custom_bottom_sheet.dart
│   │   │   │   └── custom_dialog.dart
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard_card.dart
│   │   │   │   ├── stat_card.dart
│   │   │   │   ├── recent_activity_widget.dart
│   │   │   │   └── quick_actions_widget.dart
│   │   │   ├── property/
│   │   │   │   ├── property_card.dart
│   │   │   │   ├── property_form.dart
│   │   │   │   ├── property_filter.dart
│   │   │   │   ├── property_images_carousel.dart
│   │   │   │   └── amenities_selector.dart
│   │   │   ├── payment/
│   │   │   │   ├── payment_card.dart
│   │   │   │   ├── payment_form.dart
│   │   │   │   ├── payment_method_selector.dart
│   │   │   │   ├── receipt_widget.dart
│   │   │   │   └── calendar_widget.dart
│   │   │   ├── agreement/
│   │   │   │   ├── agreement_card.dart
│   │   │   │   ├── agreement_form.dart
│   │   │   │   ├── terms_widget.dart
│   │   │   │   ├── signature_widget.dart
│   │   │   │   └── document_upload_widget.dart
│   │   │   ├── maintenance/
│   │   │   │   ├── maintenance_card.dart
│   │   │   │   ├── maintenance_form.dart
│   │   │   │   ├── status_chip.dart
│   │   │   │   ├── priority_selector.dart
│   │   │   │   ├── image_picker_widget.dart
│   │   │   │   └── rating_widget.dart
│   │   │   └── blockchain/
│   │   │       ├── blockchain_status_widget.dart
│   │   │       ├── transaction_widget.dart
│   │   │       └── verification_widget.dart
│   │   └── themes/
│   │       ├── app_colors.dart
│   │       ├── app_text_styles.dart
│   │       ├── app_dimensions.dart
│   │       └── app_decorations.dart
│   └── injection_container.dart     # Dependency injection
├── test/                           # Tests
│   ├── unit/
│   ├── widget/
│   └── integration/
├── assets/                         # Static assets
│   ├── images/
│   ├── icons/
│   ├── fonts/
│   └── animations/
├── pubspec.yaml                    # Dependencies
├── pubspec.lock
├── analysis_options.yaml          # Linter rules
└── README.md
```

## Key Dependencies

### Core Dependencies
- **flutter_bloc**: State management
- **get_it**: Dependency injection
- **dio**: HTTP client
- **shared_preferences**: Local storage
- **flutter_secure_storage**: Secure storage
- **connectivity_plus**: Network connectivity

### UI Dependencies
- **flutter_svg**: SVG support
- **cached_network_image**: Image caching
- **shimmer**: Loading animations
- **lottie**: Lottie animations
- **image_picker**: Camera/gallery access
- **file_picker**: File selection

### Payment Dependencies
- **razorpay_flutter**: Razorpay integration
- **upi_india**: UPI payments
- **pdf**: PDF generation

### Utility Dependencies
- **intl**: Internationalization
- **url_launcher**: External URLs
- **share_plus**: Content sharing
- **permission_handler**: Permissions
- **device_info_plus**: Device information

### Development Dependencies
- **flutter_test**: Testing framework
- **mockito**: Mocking
- **build_runner**: Code generation
- **json_annotation**: JSON serialization

## Architecture Pattern

This Flutter app follows **Clean Architecture** with **BLoC pattern**:

1. **Domain Layer**: Business entities, use cases, and repository interfaces
2. **Data Layer**: API calls, local storage, and repository implementations
3. **Presentation Layer**: UI, state management, and user interactions

## Getting Started

1. **Install Flutter**: Follow [Flutter installation guide](https://flutter.dev/docs/get-started/install)
2. **Clone Repository**: `git clone <repository-url>`
3. **Install Dependencies**: `flutter pub get`
4. **Run App**: `flutter run`

## Features by Role

### Tenant Features
- ✅ Dashboard with rent calendar and pending payments
- ✅ Secure payment processing with Razorpay
- ✅ Download and view rent receipts
- ✅ View and download rental agreements
- ✅ Create and track maintenance requests
- ✅ Rate completed maintenance work
- ✅ Profile management

### Landlord Features
- ✅ Comprehensive dashboard with analytics
- ✅ Property management (CRUD operations)
- ✅ Tenant management and communication
- ✅ Agreement creation and management
- ✅ Payment tracking and history
- ✅ Maintenance request handling
- ✅ Revenue analytics and reports
- ✅ Profile and bank details management

### Shared Features
- ✅ Secure authentication (email/phone + OTP)
- ✅ Document viewing and sharing
- ✅ Push notifications
- ✅ Blockchain verification
- ✅ Multi-language support (Hindi/English)
- ✅ Dark/Light theme
- ✅ Offline support for critical data

## Development Guidelines

1. **Code Style**: Follow [Dart style guide](https://dart.dev/guides/language/effective-dart/style)
2. **Testing**: Write unit tests for business logic
3. **Documentation**: Comment complex logic and APIs
4. **Error Handling**: Implement proper error handling
5. **Performance**: Optimize for smooth 60fps UI

## State Management with BLoC

Each feature module has its own BLoC:
- **AuthBloc**: Handles authentication states
- **PropertyBloc**: Manages property data
- **PaymentBloc**: Handles payment processing
- **AgreementBloc**: Manages agreements
- **MaintenanceBloc**: Handles maintenance requests

## Responsive Design

The app is designed to work across:
- **Mobile**: iOS and Android phones
- **Tablet**: iPads and Android tablets
- **Web**: Progressive Web App (PWA)

## Security Features

1. **Secure Storage**: Sensitive data encrypted
2. **API Security**: JWT tokens with refresh mechanism
3. **Biometric Auth**: Fingerprint/Face ID support
4. **Certificate Pinning**: Network security
5. **Obfuscation**: Code protection in release builds

This structure provides a scalable, maintainable, and feature-rich Flutter application for the rental management system.