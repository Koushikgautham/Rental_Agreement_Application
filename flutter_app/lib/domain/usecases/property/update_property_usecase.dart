import 'package:dartz/dartz.dart';
import '../../entities/property.dart';
import '../../repositories/property_repository.dart';
import '../../../core/error/failures.dart';

class UpdatePropertyUseCase {
  final PropertyRepository repository;

  const UpdatePropertyUseCase(this.repository);

  Future<Either<Failure, Property>> call({
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
    return await repository.updateProperty(
      propertyId: propertyId,
      title: title,
      description: description,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      rent: rent,
      securityDeposit: securityDeposit,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      squareFeet: squareFeet,
      amenities: amenities,
      images: images,
      status: status,
    );
  }
}