import 'package:dartz/dartz.dart';
import '../../repositories/blockchain_repository.dart';
import '../../../core/error/failures.dart';

class VerifyDocumentUseCase {
  final BlockchainRepository repository;

  const VerifyDocumentUseCase(this.repository);

  Future<Either<Failure, bool>> call({
    required String documentId,
    required String providedHash,
  }) async {
    return await repository.verifyDocumentHash(
      documentId: documentId,
      providedHash: providedHash,
    );
  }
}