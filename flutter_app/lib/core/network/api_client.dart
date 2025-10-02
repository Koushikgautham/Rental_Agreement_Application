import 'package:dio/dio.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  late Dio _dio;
  final SecureStorage _secureStorage;
  
  ApiClient(this._secureStorage) {
    _dio = Dio();
    _configureDio();
    _initializeInterceptors();
  }
  
  void _configureDio() {
    _dio.options = BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: Duration(seconds: AppConstants.connectionTimeout),
      receiveTimeout: Duration(seconds: AppConstants.receiveTimeout),
      sendTimeout: Duration(seconds: AppConstants.sendTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );
  }
  
  void _initializeInterceptors() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Add auth token if available
          final token = await _secureStorage.getAuthToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onResponse: (response, handler) {
          handler.next(response);
        },
        onError: (error, handler) {
          // Handle common errors
          if (error.response?.statusCode == 401) {
            // Token expired, redirect to login
            _handleUnauthorized();
          }
          handler.next(error);
        },
      ),
    );
  }
  
  void _handleUnauthorized() async {
    // Clear stored tokens
    await _secureStorage.deleteAuthToken();
    await _secureStorage.deleteRefreshToken();
    // Navigate to login page would be handled by the BLoC layer
  }
  
  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? queryParameters}) async {
    return await _dio.get<T>(path, queryParameters: queryParameters);
  }
  
  Future<Response<T>> post<T>(String path, {dynamic data}) async {
    return await _dio.post<T>(path, data: data);
  }
  
  Future<Response<T>> put<T>(String path, {dynamic data}) async {
    return await _dio.put<T>(path, data: data);
  }
  
  Future<Response<T>> delete<T>(String path) async {
    return await _dio.delete<T>(path);
  }
}