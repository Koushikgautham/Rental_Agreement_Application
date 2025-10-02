import 'package:dartz/dartz.dart';
import '../../domain/entities/payment.dart';
import '../../domain/repositories/payment_repository.dart';
import '../../core/error/failures.dart';

class PaymentRepositoryImpl implements PaymentRepository {
  @override
  Future<Either<Failure, String>> createPaymentOrder({
    required String agreementId,
    required double amount,
    required String type,
    String? notes,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<Payment>>> getOverduePayments({
    required String userId,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, Payment>> getPaymentById(String paymentId) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<Payment>>> getPaymentHistory({
    String? userId,
    String? agreementId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<Payment>>> getPendingPayments({
    required String userId,
    String? type,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, double>> getTotalPayments({
    String? userId,
    String? agreementId,
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, void>> updatePaymentStatus({
    required String paymentId,
    required String status,
    String? transactionHash,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, Payment>> verifyPayment({
    required String paymentId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }
}