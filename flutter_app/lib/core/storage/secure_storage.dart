import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

abstract class SecureStorage {
  Future<void> write(String key, String value);
  Future<String?> read(String key);
  Future<void> delete(String key);
  Future<void> deleteAll();
  
  // Convenience methods
  Future<String?> getAuthToken() => read(AppConstants.authTokenKey);
  Future<String?> getRefreshToken() => read(AppConstants.refreshTokenKey);
  Future<void> saveAuthToken(String token) => write(AppConstants.authTokenKey, token);
  Future<void> saveRefreshToken(String token) => write(AppConstants.refreshTokenKey, token);
  Future<void> deleteAuthToken() => delete(AppConstants.authTokenKey);
  Future<void> deleteRefreshToken() => delete(AppConstants.refreshTokenKey);
}

class SecureStorageImpl implements SecureStorage {
  static const _storage = FlutterSecureStorage();
  
  @override
  Future<void> write(String key, String value) async {
    await _storage.write(key: key, value: value);
  }
  
  @override
  Future<String?> read(String key) async {
    return await _storage.read(key: key);
  }
  
  @override
  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }
  
  @override
  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
  
  @override
  Future<String?> getAuthToken() => read(AppConstants.authTokenKey);
  
  @override
  Future<String?> getRefreshToken() => read(AppConstants.refreshTokenKey);
  
  @override
  Future<void> saveAuthToken(String token) => write(AppConstants.authTokenKey, token);
  
  @override
  Future<void> saveRefreshToken(String token) => write(AppConstants.refreshTokenKey, token);
  
  @override
  Future<void> deleteAuthToken() => delete(AppConstants.authTokenKey);
  
  @override
  Future<void> deleteRefreshToken() => delete(AppConstants.refreshTokenKey);
}