import 'package:dartz/dartz.dart';
import '../../entities/payment.dart';
import '../../repositories/payment_repository.dart';
import '../../../core/error/failures.dart';

class GetPaymentHistoryUseCase {
  final PaymentRepository repository;

  const GetPaymentHistoryUseCase(this.repository);

  Future<Either<Failure, List<Payment>>> call({
    String? userId,
    String? agreementId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    return await repository.getPaymentHistory(
      userId: userId,
      agreementId: agreementId,
      status: status,
      limit: limit,
      offset: offset,
    );
  }
}