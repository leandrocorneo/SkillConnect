import 'package:dartz/dartz.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/core/utils/usecases/usecase.dart';
import 'package:mobile/src/features/auth/domain/models/login_model.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/domain/repositories/abstract_login_repository.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

class LoginUseCase extends UseCase<UserModel, LoginParams> {
  final AbstractLoginRepository abstractLoginRepository;

  LoginUseCase(this.abstractLoginRepository);

  @override
  Future<Either<Failure, UserModel>> execute(LoginParams params) async {
    final result = await abstractLoginRepository.login(params);

    return result.fold((l) => Left(l), (r) => Right(r));
  }
}
