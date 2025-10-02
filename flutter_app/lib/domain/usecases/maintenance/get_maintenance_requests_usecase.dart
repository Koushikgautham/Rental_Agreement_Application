import 'package:dartz/dartz.dart';
import '../../entities/maintenance_request.dart';
import '../../repositories/maintenance_repository.dart';
import '../../../core/error/failures.dart';

class GetMaintenanceRequestsUseCase {
  final MaintenanceRepository repository;

  const GetMaintenanceRequestsUseCase(this.repository);

  Future<Either<Failure, List<MaintenanceRequest>>> call({
    String? userId,
    String? propertyId,
    String? status,
    String? priority,
    int? limit,
    int? offset,
  }) async {
    return await repository.getMaintenanceRequests(
      userId: userId,
      propertyId: propertyId,
      status: status,
      priority: priority,
      limit: limit,
      offset: offset,
    );
  }
}