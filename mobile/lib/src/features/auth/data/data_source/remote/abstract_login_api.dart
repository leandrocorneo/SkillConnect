import 'package:mobile/src/features/auth/domain/models/login_model.dart';
import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/domain/models/login_response_model.dart';

abstract class AbstractLoginApi {
  Future<LoginApiresponse<LoginModel>> login(LoginParams params);
}
