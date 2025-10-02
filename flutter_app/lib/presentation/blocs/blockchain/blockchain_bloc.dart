import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class BlockchainEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class VerifyDocument extends BlockchainEvent {
  final String documentHash;
  
  VerifyDocument(this.documentHash);
  
  @override
  List<Object?> get props => [documentHash];
}

// States
abstract class BlockchainState extends Equatable {
  @override
  List<Object?> get props => [];
}

class BlockchainInitial extends BlockchainState {}

class BlockchainLoading extends BlockchainState {}

class BlockchainVerified extends BlockchainState {
  final bool isVerified;
  
  BlockchainVerified(this.isVerified);
  
  @override
  List<Object?> get props => [isVerified];
}

class BlockchainError extends BlockchainState {
  final String message;
  
  BlockchainError(this.message);
  
  @override
  List<Object?> get props => [message];
}

// BLoC
class BlockchainBloc extends Bloc<BlockchainEvent, BlockchainState> {
  BlockchainBloc({
    required dynamic storeAgreementHashUseCase,
    required dynamic storePaymentHashUseCase,
    required dynamic createEscrowUseCase,
    required dynamic verifyDocumentUseCase,
  }) : super(BlockchainInitial()) {
    on<VerifyDocument>(_onVerifyDocument);
  }
  
  void _onVerifyDocument(VerifyDocument event, Emitter<BlockchainState> emit) {
    emit(BlockchainLoading());
    // TODO: Implement document verification logic
    emit(BlockchainVerified(true));
  }
}