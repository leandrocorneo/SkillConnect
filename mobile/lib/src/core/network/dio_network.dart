import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:mobile/src/core/utils/constanst/network_constant.dart';
import 'package:path_provider/path_provider.dart';

class DioNetwork {
  static late Dio appApi;
  static late Dio retryApi;
  static late PersistCookieJar cookieJar;

  static void initDio() async {
    final dir = await getApplicationDocumentsDirectory();
    cookieJar = PersistCookieJar(storage: FileStorage('${dir.path}/.cookies/'));

    appApi = Dio(baseOptions(apiUrl));
    appApi.interceptors.add(CookieManager(cookieJar));

    retryApi = Dio(baseOptions(apiUrl));
    retryApi.interceptors.add(CookieManager(cookieJar));
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
