import 'dart:convert';
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

// Mock implementation for development/testing
class AuthRemoteDataSourceMock implements AuthRemoteDataSource {
  // Mock user data
  final Map<String, dynamic> _mockUser = {
    'id': '1',
    'email': 'demo@example.com',
    'firstName': 'Demo',
    'lastName': 'User',
    'role': 'landlord',
    'phone': '+91 9876543210',
    'avatar': null,
    'isVerified': true,
  };

  @override
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock successful login for demo purposes
    if (email.isNotEmpty && password.isNotEmpty) {
      return UserModel.fromJson(_mockUser);
    } else {
      throw const ServerFailure('Invalid credentials');
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
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Mock successful registration
    final newUser = Map<String, dynamic>.from(_mockUser);
    newUser['email'] = email;
    newUser['firstName'] = firstName;
    newUser['lastName'] = lastName;
    newUser['role'] = role;
    if (phone != null) newUser['phone'] = phone;
    
    return UserModel.fromJson(newUser);
  }

  @override
  Future<void> logout() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    // Mock successful logout
  }

  @override
  Future<UserModel> getCurrentUser() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Return mock user
    return UserModel.fromJson(_mockUser);
  }

  @override
  Future<void> forgotPassword({
    required String email,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    // Mock successful forgot password
  }

  @override
  Future<void> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    // Mock successful password reset
  }

  @override
  Future<UserModel> updateProfile({
    required String userId,
    String? firstName,
    String? lastName,
    String? phone,
    String? avatar,
  }) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    final updatedUser = Map<String, dynamic>.from(_mockUser);
    if (firstName != null) updatedUser['firstName'] = firstName;
    if (lastName != null) updatedUser['lastName'] = lastName;
    if (phone != null) updatedUser['phone'] = phone;
    if (avatar != null) updatedUser['avatar'] = avatar;
    
    return UserModel.fromJson(updatedUser);
  }
}

// Real implementation (commented out for now)
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