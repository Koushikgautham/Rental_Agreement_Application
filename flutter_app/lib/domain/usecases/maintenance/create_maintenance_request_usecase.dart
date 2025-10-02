import 'package:dartz/dartz.dart';
import '../../entities/maintenance_request.dart';
import '../../repositories/maintenance_repository.dart';
import '../../../core/error/failures.dart';

class CreateMaintenanceRequestUseCase {
  final MaintenanceRepository repository;

  const CreateMaintenanceRequestUseCase(this.repository);

  Future<Either<Failure, MaintenanceRequest>> call({
    required String propertyId,
    required String tenantId,
    required String landlordId,
    required String title,
    required String description,
    required String category,
    required String priority,
    List<String>? images,
  }) async {
    return await repository.createMaintenanceRequest(
      propertyId: propertyId,
      tenantId: tenantId,
      landlordId: landlordId,
      title: title,
      description: description,
      category: category,
      priority: priority,
      images: images,
    );
  }
}