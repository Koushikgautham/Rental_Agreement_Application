import 'package:dartz/dartz.dart';
import '../../entities/maintenance_request.dart';
import '../../repositories/maintenance_repository.dart';
import '../../../core/error/failures.dart';

class UpdateMaintenanceRequestUseCase {
  final MaintenanceRepository repository;

  const UpdateMaintenanceRequestUseCase(this.repository);

  Future<Either<Failure, MaintenanceRequest>> call({
    required String requestId,
    String? status,
    double? estimatedCost,
    double? actualCost,
    DateTime? scheduledDate,
    DateTime? completedDate,
    String? assignedTo,
  }) async {
    return await repository.updateMaintenanceRequest(
      requestId: requestId,
      status: status,
      estimatedCost: estimatedCost,
      actualCost: actualCost,
      scheduledDate: scheduledDate,
      completedDate: completedDate,
      assignedTo: assignedTo,
    );
  }
}