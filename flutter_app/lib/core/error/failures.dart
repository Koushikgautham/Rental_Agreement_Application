import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  const Failure([List<dynamic> properties = const <dynamic>[]]);

  @override
  List<Object> get props => [];
}

// General failures
class ServerFailure extends Failure {
  final String message;

  const ServerFailure(this.message);

  @override
  List<Object> get props => [message];
}

class CacheFailure extends Failure {
  final String message;

  const CacheFailure(this.message);

  @override
  List<Object> get props => [message];
}

class NetworkFailure extends Failure {
  final String message;

  const NetworkFailure(this.message);

  @override
  List<Object> get props => [message];
}

class ValidationFailure extends Failure {
  final String message;

  const ValidationFailure(this.message);

  @override
  List<Object> get props => [message];
}

class AuthFailure extends Failure {
  final String message;

  const AuthFailure(this.message);

  @override
  List<Object> get props => [message];
}

class PaymentFailure extends Failure {
  final String message;

  const PaymentFailure(this.message);

  @override
  List<Object> get props => [message];
}

class BlockchainFailure extends Failure {
  final String message;

  const BlockchainFailure(this.message);

  @override
  List<Object> get props => [message];
}