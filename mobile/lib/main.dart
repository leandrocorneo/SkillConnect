import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mobile/src/app.dart';
import 'package:mobile/src/core/utils/injections.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await initInjections();

  runApp(DevicePreview(builder: (context) => const MyApp(), enabled: true));

  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
}
