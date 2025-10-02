import 'package:dartz/dartz.dart';
import '../../entities/rental_agreement.dart';
import '../../repositories/agreement_repository.dart';
import '../../../core/error/failures.dart';

class SignAgreementUseCase {
  final AgreementRepository repository;

  const SignAgreementUseCase(this.repository);

  Future<Either<Failure, RentalAgreement>> call({
    required String agreementId,
    required String documentHash,
  }) async {
    return await repository.signAgreement(
      agreementId: agreementId,
      documentHash: documentHash,
    );
  }
}