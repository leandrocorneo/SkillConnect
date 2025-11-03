import 'package:mobile/src/features/auth/domain/models/login_param.dart';
import 'package:mobile/src/features/auth/domain/models/login_response_model.dart';
import 'package:mobile/src/shared/domain/model/user_model.dart';

abstract class AbstractLoginApi {
  Future<LoginApiResponse<UserModel>> login(LoginParams params);
}
