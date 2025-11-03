import 'package:dartz/dartz.dart';
import 'package:mobile/src/core/network/error/exceptions.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/features/auth/data/data_source/remote/login/login_impl_api.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/data/data_source/remote/token_verify/token_verify_impl_api.dart';
import 'package:mobile/src/features/auth/domain/repositories/abstract_login_repository.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

class LoginRepoImpl implements AbstractLoginRepository {
  final LoginImplApi loginImplApi;
  final TokenVerifyImplApi tokenVerifyImplApi;

  LoginRepoImpl(this.loginImplApi, this.tokenVerifyImplApi);

  @override
  Future<Either<Failure, UserModel>> login(LoginParams params) async {
    try {
      final result = await loginImplApi.login(params);

      print(result);

      return Right(result.data);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message, e.statusCode));
    }
  }

  @override
  Future<Either<Failure, bool>> verifyToken() async {
    try {
      final result = await tokenVerifyImplApi.verifyToken();

      print(result);

      return Right(result);
    } on ServerException catch (e) {
      return Left(ServerFailure(e.message, e.statusCode));
    }
  }
}
