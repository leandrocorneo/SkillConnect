import 'package:dio/dio.dart';
import 'package:mobile/src/core/utils/constanst/network_constant.dart';

class DioNetwork {
  static late Dio appApi;
  static late Dio retryApi;

  static void initDio() {
    appApi = Dio(baseOptions(apiUrl));

    retryApi = Dio(baseOptions(apiUrl));
  }

  static BaseOptions baseOptions(String url) {
    Map<String, dynamic> headers = {"Content-Type": "application/json"};

    return BaseOptions(
      baseUrl: url,
      headers: headers,
      responseType: ResponseType.json,
    );
  }
}
