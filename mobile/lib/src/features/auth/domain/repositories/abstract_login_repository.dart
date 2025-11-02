import 'package:mobile/src/core/network/error/failure.dart';
import 'package:dartz/dartz.dart';
import 'package:mobile/src/features/auth/domain/models/login_model.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';

abstract class AbstractLoginRepository {
  Future<Either<Failure, LoginModel>> login(LoginParams params);
}
