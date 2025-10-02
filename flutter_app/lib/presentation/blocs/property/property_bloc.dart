import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class PropertyEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadProperties extends PropertyEvent {}

class CreateProperty extends PropertyEvent {
  final Map<String, dynamic> propertyData;
  
  CreateProperty(this.propertyData);
  
  @override
  List<Object?> get props => [propertyData];
}

// States
abstract class PropertyState extends Equatable {
  @override
  List<Object?> get props => [];
}

class PropertyInitial extends PropertyState {}

class PropertyLoading extends PropertyState {}

class PropertyLoaded extends PropertyState {
  final List<dynamic> properties;
  
  PropertyLoaded(this.properties);
  
  @override
  List<Object?> get props => [properties];
}

class PropertyError extends PropertyState {
  final String message;
  
  PropertyError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// BLoC
class PropertyBloc extends Bloc<PropertyEvent, PropertyState> {
  PropertyBloc({
    required dynamic getPropertiesUseCase,
    required dynamic createPropertyUseCase,
    required dynamic updatePropertyUseCase,
    required dynamic deletePropertyUseCase,
  }) : super(PropertyInitial()) {
    on<LoadProperties>(_onLoadProperties);
    on<CreateProperty>(_onCreateProperty);
  }
  
  void _onLoadProperties(LoadProperties event, Emitter<PropertyState> emit) {
    emit(PropertyLoading());
    // TODO: Implement property loading logic
    emit(PropertyLoaded([]));
  }
  
  void _onCreateProperty(CreateProperty event, Emitter<PropertyState> emit) {
    emit(PropertyLoading());
    // TODO: Implement property creation logic
    emit(PropertyLoaded([]));
  }
}