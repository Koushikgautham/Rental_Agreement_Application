import 'package:dartz/dartz.dart';
import '../../entities/property.dart';
import '../../repositories/property_repository.dart';
import '../../../core/error/failures.dart';

class CreatePropertyUseCase {
  final PropertyRepository repository;

  const CreatePropertyUseCase(this.repository);

  Future<Either<Failure, Property>> call({
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
    return await repository.createProperty(
      landlordId: landlordId,
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
    );
  }
}