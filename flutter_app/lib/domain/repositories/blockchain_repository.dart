import 'package:dartz/dartz.dart';
import '../../core/error/failures.dart';

abstract class BlockchainRepository {
  Future<Either<Failure, String>> storeAgreementHash({
    required String agreementId,
    required String documentHash,
  });

  Future<Either<Failure, String>> storePaymentHash({
    required String paymentId,
    required String transactionHash,
  });

  Future<Either<Failure, String>> createEscrow({
    required String agreementId,
    required double amount,
    required String landlordAddress,
    required String tenantAddress,
  });

  Future<Either<Failure, bool>> verifyDocumentHash({
    required String documentId,
    required String providedHash,
  });

  Future<Either<Failure, String>> releaseEscrow({
    required String escrowId,
    required String recipientAddress,
  });

  Future<Either<Failure, Map<String, dynamic>>> getEscrowDetails({
    required String escrowId,
  });

  Future<Either<Failure, List<Map<String, dynamic>>>> getTransactionHistory({
    required String address,
    int? limit,
  });

  Future<Either<Failure, String>> getWalletBalance({
    required String address,
  });
}