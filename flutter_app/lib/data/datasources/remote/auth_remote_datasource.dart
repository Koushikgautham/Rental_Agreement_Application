import '../../../core/error/failures.dart';
import '../../../core/network/api_client.dart';
import '../../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({
    required String email,
    required String password,
  });

  Future<UserModel> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? phone,
  });

  Future<void> logout();

  Future<UserModel> getCurrentUser();

  Future<void> forgotPassword({
    required String email,
  });

  Future<void> resetPassword({
    required String token,
    required String newPassword,
  });

  Future<UserModel> updateProfile({
    required String userId,
    String? firstName,
    String? lastName,
    String? phone,
    String? avatar,
  });
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  const AuthRemoteDataSourceImpl(this.apiClient);

  @override
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await apiClient.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
      } else {
        throw const ServerFailure('Login failed');
      }
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<UserModel> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
    required String role,
    String? phone,
  }) async {
    try {
      final response = await apiClient.post('/auth/register', data: {
        'email': email,
        'password': password,
        'firstName': firstName,
        'lastName': lastName,
        'role': role,
        if (phone != null) 'phone': phone,
      });

      if (response.statusCode == 201) {
        return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
      } else {
        throw const ServerFailure('Registration failed');
      }
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<void> logout() async {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await apiClient.get('/auth/me');

      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
      } else {
        throw const ServerFailure('Failed to get current user');
      }
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<void> forgotPassword({
    required String email,
  }) async {
    try {
      await apiClient.post('/auth/forgot-password', data: {
        'email': email,
      });
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<void> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      await apiClient.post('/auth/reset-password', data: {
        'token': token,
        'newPassword': newPassword,
      });
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }

  @override
  Future<UserModel> updateProfile({
    required String userId,
    String? firstName,
    String? lastName,
    String? phone,
    String? avatar,
  }) async {
    try {
      final response = await apiClient.put('/auth/profile/$userId', data: {
        if (firstName != null) 'firstName': firstName,
        if (lastName != null) 'lastName': lastName,
        if (phone != null) 'phone': phone,
        if (avatar != null) 'avatar': avatar,
      });

      if (response.statusCode == 200) {
        return UserModel.fromJson(response.data['user'] as Map<String, dynamic>);
      } else {
        throw const ServerFailure('Failed to update profile');
      }
    } catch (e) {
      throw ServerFailure(e.toString());
    }
  }
}