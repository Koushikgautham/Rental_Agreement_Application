import 'package:dartz/dartz.dart';
import '../../repositories/blockchain_repository.dart';
import '../../../core/error/failures.dart';

class StorePaymentHashUseCase {
  final BlockchainRepository repository;

  const StorePaymentHashUseCase(this.repository);

  Future<Either<Failure, String>> call({
    required String paymentId,
    required String transactionHash,
  }) async {
    return await repository.storePaymentHash(
      paymentId: paymentId,
      transactionHash: transactionHash,
    );
  }
}