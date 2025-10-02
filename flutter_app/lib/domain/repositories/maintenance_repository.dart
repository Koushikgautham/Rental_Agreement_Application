import 'package:dartz/dartz.dart';
import '../entities/maintenance_request.dart';
import '../../core/error/failures.dart';

abstract class MaintenanceRepository {
  Future<Either<Failure, MaintenanceRequest>> createMaintenanceRequest({
    required String propertyId,
    required String tenantId,
    required String landlordId,
    required String title,
    required String description,
    required String category,
    required String priority,
    List<String>? images,
  });

  Future<Either<Failure, List<MaintenanceRequest>>> getMaintenanceRequests({
    String? userId,
    String? propertyId,
    String? status,
    String? priority,
    int? limit,
    int? offset,
  });

  Future<Either<Failure, MaintenanceRequest>> getMaintenanceRequestById(
    String requestId,
  );

  Future<Either<Failure, MaintenanceRequest>> updateMaintenanceRequest({
    required String requestId,
    String? status,
    double? estimatedCost,
    double? actualCost,
    DateTime? scheduledDate,
    DateTime? completedDate,
    String? assignedTo,
  });

  Future<Either<Failure, void>> rateMaintenanceRequest({
    required String requestId,
    required int rating,
    String? feedback,
  });

  Future<Either<Failure, List<MaintenanceRequest>>> getUrgentRequests({
    required String landlordId,
  });

  Future<Either<Failure, int>> getMaintenanceRequestsCount({
    String? userId,
    String? status,
  });
}