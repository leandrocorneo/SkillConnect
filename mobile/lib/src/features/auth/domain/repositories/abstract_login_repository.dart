import 'package:mobile/src/core/network/error/failure.dart';
import 'package:dartz/dartz.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

abstract class AbstractLoginRepository {
  Future<Either<Failure, UserModel>> login(LoginParams params);
}
