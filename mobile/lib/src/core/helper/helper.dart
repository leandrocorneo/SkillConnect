import 'package:mobile/src/core/utils/injections.dart';
import 'package:mobile/src/shared/data/data_source/app_shared_prefs.dart';

class Helper {
  static bool isDarkTheme() {
    return sl<AppSharedPrefs>().getIsDarkTheme();
  }
}
