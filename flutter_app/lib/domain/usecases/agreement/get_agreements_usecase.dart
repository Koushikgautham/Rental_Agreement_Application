import 'package:dartz/dartz.dart';
import '../../entities/rental_agreement.dart';
import '../../repositories/agreement_repository.dart';
import '../../../core/error/failures.dart';

class GetAgreementsUseCase {
  final AgreementRepository repository;

  const GetAgreementsUseCase(this.repository);

  Future<Either<Failure, List<RentalAgreement>>> call({
    String? userId,
    String? propertyId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    return await repository.getAgreements(
      userId: userId,
      propertyId: propertyId,
      status: status,
      limit: limit,
      offset: offset,
    );
  }
}