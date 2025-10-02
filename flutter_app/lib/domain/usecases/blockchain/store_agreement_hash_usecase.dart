import 'package:dartz/dartz.dart';
import '../../repositories/blockchain_repository.dart';
import '../../../core/error/failures.dart';

class StoreAgreementHashUseCase {
  final BlockchainRepository repository;

  const StoreAgreementHashUseCase(this.repository);

  Future<Either<Failure, String>> call({
    required String agreementId,
    required String documentHash,
  }) async {
    return await repository.storeAgreementHash(
      agreementId: agreementId,
      documentHash: documentHash,
    );
  }
}