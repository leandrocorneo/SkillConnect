import 'package:mobile/src/core/utils/injections.dart';
import 'package:mobile/src/shared/data/data_source/app_shared_prefs.dart';

initAppInjections() {
  sl.registerFactory<AppSharedPrefs>(() => AppSharedPrefs(sl()));
}
