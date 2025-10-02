import 'package:dartz/dartz.dart';
import '../../repositories/agreement_repository.dart';
import '../../../core/error/failures.dart';

class TerminateAgreementUseCase {
  final AgreementRepository repository;

  const TerminateAgreementUseCase(this.repository);

  Future<Either<Failure, void>> call({
    required String agreementId,
    required String reason,
  }) async {
    return await repository.terminateAgreement(
      agreementId: agreementId,
      reason: reason,
    );
  }
}