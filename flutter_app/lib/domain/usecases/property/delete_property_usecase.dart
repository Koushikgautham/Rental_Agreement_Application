import 'package:dartz/dartz.dart';
import '../../repositories/property_repository.dart';
import '../../../core/error/failures.dart';

class DeletePropertyUseCase {
  final PropertyRepository repository;

  const DeletePropertyUseCase(this.repository);

  Future<Either<Failure, void>> call(String propertyId) async {
    return await repository.deleteProperty(propertyId);
  }
}