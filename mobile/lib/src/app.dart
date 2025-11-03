import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobile/src/core/helper/helper.dart';
import 'package:mobile/src/core/router/router.dart';
import 'package:mobile/src/core/styles/app_theme.dart';
import 'package:mobile/src/features/auth/presentation/pages/auth_gate.dart';
import 'package:provider/provider.dart';
import 'package:mobile/src/core/router/app_router_enum.dart';
import 'package:device_preview/device_preview.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (_) => AppNotifier(),
          builder: (context, child) {
            return Consumer<AppNotifier>(
              builder: (context, value, child) {
                return ScreenUtilInit(
                  designSize: const Size(360, 690),
                  minTextAdapt: true,
                  splitScreenMode: true,
                  builder: (context, child) {
                    return MaterialApp(
                      title: 'Skill Connect App',
                      debugShowCheckedModeBanner: false,
                      theme: value.darkTheme ? darkAppTheme : appTheme,
                      builder: DevicePreview.appBuilder,
                      onGenerateRoute: AppRouter.generateRoute,
                      home: AuthGate(),
                    );
                  },
                );
              },
            );
          },
        ),
      ],
    );
  }
}

class AppNotifier extends ChangeNotifier {
  late bool darkTheme;

  AppNotifier() {
    _initialise();
  }

  Future _initialise() async {
    darkTheme = Helper.isDarkTheme();

    notifyListeners();
  }

  void updateThemeTitle(bool newDarkTheme) {
    darkTheme = newDarkTheme;
    if (Helper.isDarkTheme()) {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.light);
    } else {
      SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
    }
    notifyListeners();
  }
}
