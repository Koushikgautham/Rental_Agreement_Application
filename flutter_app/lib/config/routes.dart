import 'package:flutter/material.dart';

import '../presentation/pages/splash/splash_page.dart';
import '../presentation/pages/onboarding/onboarding_page.dart';
import '../presentation/pages/auth/login_page.dart';
import '../presentation/pages/auth/register_page.dart';
import '../presentation/pages/auth/forgot_password_page.dart';
import '../presentation/pages/tenant/tenant_dashboard_page.dart';
import '../presentation/pages/landlord/landlord_dashboard_page.dart';

class AppRoutes {
  // Auth Routes
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  
  // Tenant Routes
  static const String tenantDashboard = '/tenant/dashboard';
  static const String rentCalendar = '/tenant/calendar';
  static const String paymentHistory = '/tenant/payment-history';
  static const String payment = '/tenant/payment';
  static const String tenantAgreement = '/tenant/agreement';
  static const String tenantMaintenanceList = '/tenant/maintenance';
  static const String createMaintenance = '/tenant/maintenance/create';
  static const String tenantProfile = '/tenant/profile';
  
  // Landlord Routes
  static const String landlordDashboard = '/landlord/dashboard';
  static const String properties = '/landlord/properties';
  static const String createProperty = '/landlord/properties/create';
  static const String propertyDetails = '/landlord/properties/details';
  static const String tenants = '/landlord/tenants';
  static const String tenantDetails = '/landlord/tenants/details';
  static const String agreements = '/landlord/agreements';
  static const String createAgreement = '/landlord/agreements/create';
  static const String payments = '/landlord/payments';
  static const String maintenance = '/landlord/maintenance';
  static const String analytics = '/landlord/analytics';
  static const String landlordProfile = '/landlord/profile';
  
  // Shared Routes
  static const String paymentReceipt = '/payment-receipt';
  static const String maintenanceDetails = '/maintenance-details';
  static const String agreementDetails = '/agreement-details';
  static const String documentViewer = '/document-viewer';
  static const String settings = '/settings';
  
  // Error Routes
  static const String error = '/error';
  static const String noInternet = '/no-internet';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      // Auth Routes
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashPage());
      case onboarding:
        return MaterialPageRoute(builder: (_) => const OnboardingPage());
      case login:
        return MaterialPageRoute(builder: (_) => const LoginPage());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterPage());
      case forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordPage());
      
      // Tenant Routes
      case tenantDashboard:
        return MaterialPageRoute(builder: (_) => const TenantDashboardPage());
      
      // Landlord Routes
      case landlordDashboard:
        return MaterialPageRoute(builder: (_) => const LandlordDashboardPage());
      
      // Error Routes
      case error:
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Error')),
            body: const Center(child: Text('Page not found')),
          ),
        );
    }
  }
  
  // Navigation helpers
  static void pushAndClearStack(BuildContext context, String routeName) {
    Navigator.of(context).pushNamedAndRemoveUntil(
      routeName,
      (route) => false,
    );
  }
  
  static void pushReplacement(BuildContext context, String routeName, {Object? arguments}) {
    Navigator.of(context).pushReplacementNamed(routeName, arguments: arguments);
  }
  
  static void push(BuildContext context, String routeName, {Object? arguments}) {
    Navigator.of(context).pushNamed(routeName, arguments: arguments);
  }
  
  static void pop(BuildContext context, {Object? result}) {
    Navigator.of(context).pop(result);
  }
}