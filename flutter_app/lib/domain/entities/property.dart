import 'package:equatable/equatable.dart';

class Property extends Equatable {
  final String id;
  final String landlordId;
  final String title;
  final String description;
  final String address;
  final String city;
  final String state;
  final String zipCode;
  final double rent;
  final double securityDeposit;
  final int bedrooms;
  final int bathrooms;
  final double squareFeet;
  final List<String> amenities;
  final List<String> images;
  final String status; // 'available', 'rented', 'maintenance'
  final DateTime createdAt;
  final DateTime updatedAt;

  const Property({
    required this.id,
    required this.landlordId,
    required this.title,
    required this.description,
    required this.address,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.rent,
    required this.securityDeposit,
    required this.bedrooms,
    required this.bathrooms,
    required this.squareFeet,
    required this.amenities,
    required this.images,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  String get fullAddress => '$address, $city, $state $zipCode';

  bool get isAvailable => status == 'available';
  bool get isRented => status == 'rented';
  bool get isUnderMaintenance => status == 'maintenance';

  @override
  List<Object?> get props => [
        id,
        landlordId,
        title,
        description,
        address,
        city,
        state,
        zipCode,
        rent,
        securityDeposit,
        bedrooms,
        bathrooms,
        squareFeet,
        amenities,
        images,
        status,
        createdAt,
        updatedAt,
      ];
}