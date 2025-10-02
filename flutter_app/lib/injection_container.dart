import 'package:get_it/get_it.dart';

import 'core/network/api_client.dart';
import 'core/network/network_info.dart';
import 'core/storage/local_storage.dart';
import 'core/storage/secure_storage.dart';

// Data Sources
import 'data/datasources/remote/auth_remote_datasource.dart';
import 'data/datasources/local/auth_local_datasource.dart';

// Repositories
import 'data/repositories/auth_repository_impl.dart';
import 'domain/repositories/auth_repository.dart';

// Use Cases
import 'domain/usecases/auth/login_usecase.dart';
import 'domain/usecases/auth/register_usecase.dart';
import 'domain/usecases/auth/logout_usecase.dart';
import 'domain/usecases/auth/get_current_user_usecase.dart';

// BLoCs
import 'presentation/blocs/auth/auth_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  //! Features - BLoCs
  sl.registerFactory(() => AuthBloc(
        loginUseCase: sl(),
        registerUseCase: sl(),
        logoutUseCase: sl(),
        getCurrentUserUseCase: sl(),
      ));

  // TODO: Register other BLoCs when implemented

  //! Use cases
  // Auth
  sl.registerLazySingleton(() => LoginUseCase(sl()));
  sl.registerLazySingleton(() => RegisterUseCase(sl()));
  sl.registerLazySingleton(() => LogoutUseCase(sl()));
  sl.registerLazySingleton(() => GetCurrentUserUseCase(sl()));

  // TODO: Register other use cases when implemented

  //! Repository
  sl.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: sl(),
      localDataSource: sl(),
    ),
  );

  // TODO: Implement other repositories when needed

  //! Data sources
  sl.registerLazySingleton<AuthRemoteDataSource>(
    () => AuthRemoteDataSourceImpl(sl()),
  );

  sl.registerLazySingleton<AuthLocalDataSource>(
    () => AuthLocalDataSourceImpl(sl()),
  );

  // TODO: Implement other data sources when needed

  //! Core
  sl.registerLazySingleton(() => ApiClient());
  sl.registerLazySingleton<NetworkInfo>(() => NetworkInfoImpl());
  sl.registerLazySingleton<LocalStorage>(() => LocalStorageImpl());
  sl.registerLazySingleton<SecureStorage>(() => SecureStorageImpl());
}