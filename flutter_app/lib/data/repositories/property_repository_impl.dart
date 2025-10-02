import 'package:dartz/dartz.dart';
import '../../domain/entities/property.dart';
import '../../domain/repositories/property_repository.dart';
import '../../core/error/failures.dart';

class PropertyRepositoryImpl implements PropertyRepository {
  @override
  Future<Either<Failure, Property>> createProperty({
    required String landlordId,
    required String title,
    required String description,
    required String address,
    required String city,
    required String state,
    required String zipCode,
    required double rent,
    required double securityDeposit,
    required int bedrooms,
    required int bathrooms,
    required double squareFeet,
    required List<String> amenities,
    List<String>? images,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, void>> deleteProperty(String propertyId) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<Property>>> getProperties({
    String? landlordId,
    String? status,
    int? limit,
    int? offset,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, Property>> getPropertyById(String propertyId) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, List<Property>>> searchProperties({
    String? location,
    double? minRent,
    double? maxRent,
    int? minBedrooms,
    int? maxBedrooms,
    List<String>? amenities,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }

  @override
  Future<Either<Failure, Property>> updateProperty({
    required String propertyId,
    String? title,
    String? description,
    String? address,
    String? city,
    String? state,
    String? zipCode,
    double? rent,
    double? securityDeposit,
    int? bedrooms,
    int? bathrooms,
    double? squareFeet,
    List<String>? amenities,
    List<String>? images,
    String? status,
  }) async {
    // TODO: Implement
    throw UnimplementedError();
  }
}