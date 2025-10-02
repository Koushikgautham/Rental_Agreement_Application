import '../../../core/error/failures.dart';
import '../../../core/storage/secure_storage.dart';
import '../../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<UserModel?> getCachedUser();
  Future<void> cacheUser(UserModel user);
  Future<void> clearCache();
  Future<String?> getToken();
  Future<void> saveToken(String token);
  Future<void> clearToken();
}

class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final SecureStorage secureStorage;

  const AuthLocalDataSourceImpl(this.secureStorage);

  @override
  Future<UserModel?> getCachedUser() async {
    try {
      final userJson = await secureStorage.read('cached_user');
      if (userJson != null) {
        return UserModel.fromJson({
          // Parse the JSON string back to Map
          // This is a simplified implementation
        });
      }
      return null;
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }

  @override
  Future<void> cacheUser(UserModel user) async {
    try {
      // Convert user to JSON string and save
      await secureStorage.write('cached_user', user.toJson().toString());
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }

  @override
  Future<void> clearCache() async {
    try {
      await secureStorage.delete('cached_user');
      await secureStorage.delete('auth_token');
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }

  @override
  Future<String?> getToken() async {
    try {
      return await secureStorage.read('auth_token');
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }

  @override
  Future<void> saveToken(String token) async {
    try {
      await secureStorage.write('auth_token', token);
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }

  @override
  Future<void> clearToken() async {
    try {
      await secureStorage.delete('auth_token');
    } catch (e) {
      throw CacheFailure(e.toString());
    }
  }
}