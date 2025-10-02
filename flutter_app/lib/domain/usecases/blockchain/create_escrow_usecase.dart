import 'package:dartz/dartz.dart';
import '../../repositories/blockchain_repository.dart';
import '../../../core/error/failures.dart';

class CreateEscrowUseCase {
  final BlockchainRepository repository;

  const CreateEscrowUseCase(this.repository);

  Future<Either<Failure, String>> call({
    required String agreementId,
    required double amount,
    required String landlordAddress,
    required String tenantAddress,
  }) async {
    return await repository.createEscrow(
      agreementId: agreementId,
      amount: amount,
      landlordAddress: landlordAddress,
      tenantAddress: tenantAddress,
    );
  }
}