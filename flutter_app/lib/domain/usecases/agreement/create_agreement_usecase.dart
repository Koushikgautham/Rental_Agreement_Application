import 'package:dartz/dartz.dart';
import '../../entities/rental_agreement.dart';
import '../../repositories/agreement_repository.dart';
import '../../../core/error/failures.dart';

class CreateAgreementUseCase {
  final AgreementRepository repository;

  const CreateAgreementUseCase(this.repository);

  Future<Either<Failure, RentalAgreement>> call({
    required String propertyId,
    required String landlordId,
    required String tenantId,
    required DateTime startDate,
    required DateTime endDate,
    required double monthlyRent,
    required double securityDeposit,
    required List<String> terms,
  }) async {
    return await repository.createAgreement(
      propertyId: propertyId,
      landlordId: landlordId,
      tenantId: tenantId,
      startDate: startDate,
      endDate: endDate,
      monthlyRent: monthlyRent,
      securityDeposit: securityDeposit,
      terms: terms,
    );
  }
}