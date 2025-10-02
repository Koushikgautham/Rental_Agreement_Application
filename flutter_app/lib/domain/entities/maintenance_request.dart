import 'package:equatable/equatable.dart';

class MaintenanceRequest extends Equatable {
  final String id;
  final String propertyId;
  final String tenantId;
  final String landlordId;
  final String title;
  final String description;
  final String category; // 'plumbing', 'electrical', 'appliance', 'other'
  final String priority; // 'low', 'medium', 'high', 'urgent'
  final String status; // 'pending', 'in_progress', 'completed', 'rejected'
  final List<String> images;
  final double? estimatedCost;
  final double? actualCost;
  final DateTime? scheduledDate;
  final DateTime? completedDate;
  final String? assignedTo; // Service provider
  final int? rating; // 1-5 stars
  final String? feedback;
  final DateTime createdAt;
  final DateTime updatedAt;

  const MaintenanceRequest({
    required this.id,
    required this.propertyId,
    required this.tenantId,
    required this.landlordId,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.status,
    required this.images,
    this.estimatedCost,
    this.actualCost,
    this.scheduledDate,
    this.completedDate,
    this.assignedTo,
    this.rating,
    this.feedback,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isPending => status == 'pending';
  bool get isInProgress => status == 'in_progress';
  bool get isCompleted => status == 'completed';
  bool get isRejected => status == 'rejected';
  bool get isUrgent => priority == 'urgent';
  bool get isRated => rating != null;

  @override
  List<Object?> get props => [
        id,
        propertyId,
        tenantId,
        landlordId,
        title,
        description,
        category,
        priority,
        status,
        images,
        estimatedCost,
        actualCost,
        scheduledDate,
        completedDate,
        assignedTo,
        rating,
        feedback,
        createdAt,
        updatedAt,
      ];
}