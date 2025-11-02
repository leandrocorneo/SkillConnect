import 'package:dartz/dartz.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/features/auth/domain/models/login_model.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/domain/repositories/abstract_login_repository.dart';

class LoginRepoImpl implements AbstractLoginRepository {
  final AbstractLoginRepository abstractLoginRepository;

  LoginRepoImpl(this.abstractLoginRepository);

  @override
  Future<Either<Failure, LoginModel>> login(LoginParams params) async {
    final result = await abstractLoginRepository.login(params);

    return result.fold((l) => Left(l), (r) => Right(r));
  }
}
