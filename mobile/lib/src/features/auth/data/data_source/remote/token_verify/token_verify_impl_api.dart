import 'package:dio/dio.dart';
import 'package:mobile/src/features/auth/data/data_source/remote/token_verify/abstract_token_verify_api.dart';

class TokenVerifyImplApi implements AbstractTokenVerifyApi {
  final Dio dio;

  TokenVerifyImplApi(this.dio);

  @override
  Future<bool> verifyToken() async {
    try {
      await dio.get('/auth/me');

      return true;
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        return false;
      }
      rethrow;
    }
  }
}
