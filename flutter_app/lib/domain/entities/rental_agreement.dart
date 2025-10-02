import 'package:equatable/equatable.dart';

class RentalAgreement extends Equatable {
  final String id;
  final String propertyId;
  final String landlordId;
  final String tenantId;
  final DateTime startDate;
  final DateTime endDate;
  final double monthlyRent;
  final double securityDeposit;
  final String status; // 'draft', 'active', 'terminated', 'expired'
  final List<String> terms;
  final String? documentHash; // Blockchain hash
  final DateTime? signedDate;
  final DateTime createdAt;
  final DateTime updatedAt;

  const RentalAgreement({
    required this.id,
    required this.propertyId,
    required this.landlordId,
    required this.tenantId,
    required this.startDate,
    required this.endDate,
    required this.monthlyRent,
    required this.securityDeposit,
    required this.status,
    required this.terms,
    this.documentHash,
    this.signedDate,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isActive => status == 'active';
  bool get isDraft => status == 'draft';
  bool get isTerminated => status == 'terminated';
  bool get isExpired => status == 'expired';
  bool get isSigned => signedDate != null;

  int get durationInMonths {
    return endDate.difference(startDate).inDays ~/ 30;
  }

  @override
  List<Object?> get props => [
        id,
        propertyId,
        landlordId,
        tenantId,
        startDate,
        endDate,
        monthlyRent,
        securityDeposit,
        status,
        terms,
        documentHash,
        signedDate,
        createdAt,
        updatedAt,
      ];
}