import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class AgreementEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoadAgreements extends AgreementEvent {}

// States
abstract class AgreementState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AgreementInitial extends AgreementState {}

class AgreementLoading extends AgreementState {}

class AgreementLoaded extends AgreementState {
  final List<dynamic> agreements;
  
  AgreementLoaded(this.agreements);
  
  @override
  List<Object?> get props => [agreements];
}

class AgreementError extends AgreementState {
  final String message;
  
  AgreementError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// BLoC
class AgreementBloc extends Bloc<AgreementEvent, AgreementState> {
  AgreementBloc({
    required dynamic createAgreementUseCase,
    required dynamic signAgreementUseCase,
    required dynamic getAgreementsUseCase,
    required dynamic terminateAgreementUseCase,
  }) : super(AgreementInitial()) {
    on<LoadAgreements>(_onLoadAgreements);
  }
  
  void _onLoadAgreements(LoadAgreements event, Emitter<AgreementState> emit) {
    emit(AgreementLoading());
    // TODO: Implement agreement loading logic
    emit(AgreementLoaded([]));
  }
}