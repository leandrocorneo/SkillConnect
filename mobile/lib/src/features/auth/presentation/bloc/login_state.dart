import 'package:equatable/equatable.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

abstract class LoginState extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoginInitial extends LoginState {}

class LoginLoading extends LoginState {}

class LoginSuccess extends LoginState {
  final UserModel userModel;

  LoginSuccess(this.userModel);

  @override
  List<Object?> get props => [userModel];
}

class LoginFailure extends LoginState {
  final String error;

  LoginFailure(this.error);

  @override
  List<Object?> get props => [error];
}
