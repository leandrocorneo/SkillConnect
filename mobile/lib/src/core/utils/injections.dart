import 'package:get_it/get_it.dart';
import 'package:mobile/src/core/network/dio_network.dart';
import 'package:mobile/src/shared/app_injections.dart';
import 'package:shared_preferences/shared_preferences.dart';

final sl = GetIt.instance;

Future<void> initInjections() async {
  await initDioInjections();
  await initSharedPrefsInjections();
  await initAppInjections();
}

initSharedPrefsInjections() async {
  sl.registerSingletonAsync<SharedPreferences>(() async {
    return await SharedPreferences.getInstance();
  });

  await sl.isReady<SharedPreferences>();
}

Future<void> initDioInjections() async {
  DioNetwork.initDio();
}
