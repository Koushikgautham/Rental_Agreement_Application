import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class MaintenanceEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadMaintenanceRequests extends MaintenanceEvent {}

// States
abstract class MaintenanceState extends Equatable {
  @override
  List<Object?> get props => [];
}

class MaintenanceInitial extends MaintenanceState {}

class MaintenanceLoading extends MaintenanceState {}

class MaintenanceLoaded extends MaintenanceState {
  final List<dynamic> requests;
  
  MaintenanceLoaded(this.requests);
  
  @override
  List<Object?> get props => [requests];
}

class MaintenanceError extends MaintenanceState {
  final String message;
  
  MaintenanceError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// BLoC
class MaintenanceBloc extends Bloc<MaintenanceEvent, MaintenanceState> {
  MaintenanceBloc({
    required dynamic createMaintenanceRequestUseCase,
    required dynamic getMaintenanceRequestsUseCase,
    required dynamic updateMaintenanceRequestUseCase,
    required dynamic rateMaintenanceUseCase,
  }) : super(MaintenanceInitial()) {
    on<LoadMaintenanceRequests>(_onLoadMaintenanceRequests);
  }
  
  void _onLoadMaintenanceRequests(LoadMaintenanceRequests event, Emitter<MaintenanceState> emit) {
    emit(MaintenanceLoading());
    // TODO: Implement maintenance loading logic
    emit(MaintenanceLoaded([]));
  }
}