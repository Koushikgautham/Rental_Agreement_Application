import 'package:dartz/dartz.dart';
import '../../entities/payment.dart';
import '../../repositories/payment_repository.dart';
import '../../../core/error/failures.dart';

class GetPendingPaymentsUseCase {
  final PaymentRepository repository;

  const GetPendingPaymentsUseCase(this.repository);

  Future<Either<Failure, List<Payment>>> call({
    required String userId,
    String? type,
  }) async {
    return await repository.getPendingPayments(
      userId: userId,
      type: type,
    );
  }
}