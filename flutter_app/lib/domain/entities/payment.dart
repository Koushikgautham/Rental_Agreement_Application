import 'package:equatable/equatable.dart';

class Payment extends Equatable {
  final String id;
  final String agreementId;
  final String tenantId;
  final String landlordId;
  final double amount;
  final String type; // 'rent', 'security_deposit', 'maintenance'
  final String status; // 'pending', 'completed', 'failed'
  final DateTime dueDate;
  final DateTime? paidDate;
  final String? paymentMethod; // 'upi', 'card', 'bank_transfer'
  final String? razorpayOrderId;
  final String? razorpayPaymentId;
  final String? transactionHash; // Blockchain hash
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Payment({
    required this.id,
    required this.agreementId,
    required this.tenantId,
    required this.landlordId,
    required this.amount,
    required this.type,
    required this.status,
    required this.dueDate,
    this.paidDate,
    this.paymentMethod,
    this.razorpayOrderId,
    this.razorpayPaymentId,
    this.transactionHash,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isPending => status == 'pending';
  bool get isCompleted => status == 'completed';
  bool get isFailed => status == 'failed';
  bool get isOverdue => isPending && DateTime.now().isAfter(dueDate);

  int get daysOverdue {
    if (!isOverdue) return 0;
    return DateTime.now().difference(dueDate).inDays;
  }

  @override
  List<Object?> get props => [
        id,
        agreementId,
        tenantId,
        landlordId,
        amount,
        type,
        status,
        dueDate,
        paidDate,
        paymentMethod,
        razorpayOrderId,
        razorpayPaymentId,
        transactionHash,
        notes,
        createdAt,
        updatedAt,
      ];
}