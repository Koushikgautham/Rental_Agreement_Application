import 'package:dartz/dartz.dart';
import '../../entities/property.dart';
import '../../repositories/property_repository.dart';
import '../../../core/error/failures.dart';

class GetPropertiesUseCase {
  final PropertyRepository repository;

  const GetPropertiesUseCase(this.repository);

  Future<Either<Failure, List<Property>>> call({
    String? landlordId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    return await repository.getProperties(
      landlordId: landlordId,
      status: status,
      limit: limit,
      offset: offset,
    );
  }
}