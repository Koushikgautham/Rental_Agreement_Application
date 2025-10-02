import 'package:dartz/dartz.dart';
import '../../repositories/maintenance_repository.dart';
import '../../../core/error/failures.dart';

class RateMaintenanceUseCase {
  final MaintenanceRepository repository;

  const RateMaintenanceUseCase(this.repository);

  Future<Either<Failure, void>> call({
    required String requestId,
    required int rating,
    String? feedback,
  }) async {
    return await repository.rateMaintenanceRequest(
      requestId: requestId,
      rating: rating,
      feedback: feedback,
    );
  }
}