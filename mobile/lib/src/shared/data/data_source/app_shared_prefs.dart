import 'package:mobile/src/core/utils/constanst/shared_preferences_constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSharedPrefs {
  final SharedPreferences _preferences;

  AppSharedPrefs(this._preferences);

  bool getIsDarkTheme() {
    return _preferences.getBool(theme) ?? false;
  }

  void setIsDarkTheme(bool value) {
    _preferences.setBool(theme, value);
  }
}
