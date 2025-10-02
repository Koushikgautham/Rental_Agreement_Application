import 'package:dartz/dartz.dart';
import '../entities/rental_agreement.dart';
import '../../core/error/failures.dart';

abstract class AgreementRepository {
  Future<Either<Failure, RentalAgreement>> createAgreement({
    required String propertyId,
    required String landlordId,
    required String tenantId,
    required DateTime startDate,
    required DateTime endDate,
    required double monthlyRent,
    required double securityDeposit,
    required List<String> terms,
  });

  Future<Either<Failure, RentalAgreement>> signAgreement({
    required String agreementId,
    required String documentHash,
  });

  Future<Either<Failure, List<RentalAgreement>>> getAgreements({
    String? userId,
    String? propertyId,
    String? status,
    int? limit,
    int? offset,
  });

  Future<Either<Failure, RentalAgreement>> getAgreementById(String agreementId);

  Future<Either<Failure, RentalAgreement>> updateAgreement({
    required String agreementId,
    DateTime? startDate,
    DateTime? endDate,
    double? monthlyRent,
    double? securityDeposit,
    List<String>? terms,
    String? status,
  });

  Future<Either<Failure, void>> terminateAgreement({
    required String agreementId,
    required String reason,
  });

  Future<Either<Failure, List<RentalAgreement>>> getActiveAgreements({
    required String userId,
  });

  Future<Either<Failure, RentalAgreement?>> getAgreementByProperty({
    required String propertyId,
  });
}