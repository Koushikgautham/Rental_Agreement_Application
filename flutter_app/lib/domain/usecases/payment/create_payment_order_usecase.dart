import 'package:dartz/dartz.dart';
import '../../repositories/payment_repository.dart';
import '../../../core/error/failures.dart';

class CreatePaymentOrderUseCase {
  final PaymentRepository repository;

  const CreatePaymentOrderUseCase(this.repository);

  Future<Either<Failure, String>> call({
    required String agreementId,
    required double amount,
    required String type,
    String? notes,
  }) async {
    return await repository.createPaymentOrder(
      agreementId: agreementId,
      amount: amount,
      type: type,
      notes: notes,
    );
  }
}