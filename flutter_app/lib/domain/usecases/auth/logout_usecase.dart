import 'package:dartz/dartz.dart';
import '../../repositories/auth_repository.dart';
import '../../../core/error/failures.dart';

class LogoutUseCase {
  final AuthRepository repository;

  const LogoutUseCase(this.repository);

  Future<Either<Failure, void>> call() async {
    return await repository.logout();
  }
}