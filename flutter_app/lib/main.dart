import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'config/routes.dart';
import 'config/theme.dart';
import 'core/constants/app_constants.dart';
import 'injection_container.dart' as di;
import 'presentation/blocs/auth/auth_bloc.dart';
import 'presentation/blocs/property/property_bloc.dart';
import 'presentation/blocs/payment/payment_bloc.dart';
import 'presentation/blocs/agreement/agreement_bloc.dart';
import 'presentation/blocs/maintenance/maintenance_bloc.dart';
import 'presentation/blocs/blockchain/blockchain_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize dependency injection
  await di.init();
  
  // Set system UI overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      systemNavigationBarColor: Colors.white,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  runApp(const RentalManagementApp());
}

class RentalManagementApp extends StatelessWidget {
  const RentalManagementApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (_) => di.sl<AuthBloc>()..add(AppStarted()),
        ),
        BlocProvider<PropertyBloc>(
          create: (_) => di.sl<PropertyBloc>(),
        ),
        BlocProvider<PaymentBloc>(
          create: (_) => di.sl<PaymentBloc>(),
        ),
        BlocProvider<AgreementBloc>(
          create: (_) => di.sl<AgreementBloc>(),
        ),
        BlocProvider<MaintenanceBloc>(
          create: (_) => di.sl<MaintenanceBloc>(),
        ),
        BlocProvider<BlockchainBloc>(
          create: (_) => di.sl<BlockchainBloc>(),
        ),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        onGenerateRoute: AppRoutes.generateRoute,
        initialRoute: AppRoutes.splash,
        supportedLocales: const [
          Locale('en', 'US'), // English
          Locale('hi', 'IN'), // Hindi
        ],
        localizationsDelegates: const [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        locale: const Locale('en', 'US'),
        builder: (context, child) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(
              textScaler: const TextScaler.linear(1.0),
            ),
            child: child!,
          );
        },
      ),
    );
  }
}