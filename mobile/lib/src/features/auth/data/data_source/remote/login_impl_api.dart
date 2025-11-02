import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:mobile/src/core/network/error/exceptions.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/features/auth/data/data_source/remote/abstract_login_api.dart';
import 'package:mobile/src/features/auth/domain/models/login_model.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/domain/models/login_response_model.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

class LoginImplApi implements AbstractLoginApi {
  final Dio dio;

  LoginImplApi(this.dio);

  @override
  Future<LoginApiresponse<LoginModel>> login(LoginParams params) async {
    try {
      final result = await dio.post('/auth/login', data: params.toJson());

      if (result.data == null)
        throw ServerException("Unknown Error", result.statusCode);

      return LoginApiresponse.fromJson<LoginModel>(
        result.data,
        UserModel.fromJson,
      );
    } on ServerException {
      rethrow;
    }
  }
}
