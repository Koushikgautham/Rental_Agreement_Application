import 'package:dartz/dartz.dart';
import '../../entities/payment.dart';
import '../../repositories/payment_repository.dart';
import '../../../core/error/failures.dart';

class VerifyPaymentUseCase {
  final PaymentRepository repository;

  const VerifyPaymentUseCase(this.repository);

  Future<Either<Failure, Payment>> call({
    required String paymentId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) async {
    return await repository.verifyPayment(
      paymentId: paymentId,
      razorpayPaymentId: razorpayPaymentId,
      razorpaySignature: razorpaySignature,
    );
  }
}