import 'package:dartz/dartz.dart';
import '../../domain/entities/rental_agreement.dart';
import '../../domain/repositories/agreement_repository.dart';
import '../../core/error/failures.dart';

class AgreementRepositoryImpl implements AgreementRepository {
  @override
  Future<Either<Failure, RentalAgreement>> createAgreement({
    required String propertyId,
    required String landlordId,
    required String tenantId,
    required DateTime startDate,
    required DateTime endDate,
    required double monthlyRent,
    required double securityDeposit,
    required List<String> terms,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<RentalAgreement>>> getActiveAgreements({
    required String userId,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, RentalAgreement>> getAgreementById(String agreementId) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, RentalAgreement?>> getAgreementByProperty({
    required String propertyId,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<RentalAgreement>>> getAgreements({
    String? userId,
    String? propertyId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, RentalAgreement>> signAgreement({
    required String agreementId,
    required String documentHash,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, void>> terminateAgreement({
    required String agreementId,
    required String reason,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, RentalAgreement>> updateAgreement({
    required String agreementId,
    DateTime? startDate,
    DateTime? endDate,
    double? monthlyRent,
    double? securityDeposit,
    List<String>? terms,
    String? status,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }
}