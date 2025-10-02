import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String firstName;
  final String lastName;
  final String role; // 'landlord' or 'tenant'
  final String? phone;
  final String? avatar;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.role,
    this.phone,
    this.avatar,
    required this.createdAt,
    required this.updatedAt,
  });

  String get fullName => '$firstName $lastName';

  bool get isLandlord => role == 'landlord';
  bool get isTenant => role == 'tenant';

  @override
  List<Object?> get props => [
        id,
        email,
        firstName,
        lastName,
        role,
        phone,
        avatar,
        createdAt,
        updatedAt,
      ];
}