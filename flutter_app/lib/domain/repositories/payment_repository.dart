import 'package:dartz/dartz.dart';
import '../entities/payment.dart';
import '../../core/error/failures.dart';

abstract class PaymentRepository {
  Future<Either<Failure, String>> createPaymentOrder({
    required String agreementId,
    required double amount,
    required String type,
    String? notes,
  });

  Future<Either<Failure, Payment>> verifyPayment({
    required String paymentId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  });

  Future<Either<Failure, List<Payment>>> getPaymentHistory({
    String? userId,
    String? agreementId,
    String? status,
    int? limit,
    int? offset,
  });

  Future<Either<Failure, List<Payment>>> getPendingPayments({
    required String userId,
    String? type,
  });

  Future<Either<Failure, Payment>> getPaymentById(String paymentId);

  Future<Either<Failure, void>> updatePaymentStatus({
    required String paymentId,
    required String status,
    String? transactionHash,
  });

  Future<Either<Failure, double>> getTotalPayments({
    String? userId,
    String? agreementId,
    DateTime? startDate,
    DateTime? endDate,
  });

  Future<Either<Failure, List<Payment>>> getOverduePayments({
    required String userId,
  });
}