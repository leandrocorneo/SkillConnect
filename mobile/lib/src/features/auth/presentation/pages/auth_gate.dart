import 'package:dartz/dartz.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mobile/src/core/network/dio_network.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/core/utils/injections.dart';
import 'package:mobile/src/core/utils/usecases/usecase.dart';
import 'package:mobile/src/features/auth/domain/usecases/verify_token_usecase.dart';
import 'package:mobile/src/features/auth/presentation/pages/login_page.dart';
import 'package:mobile/src/features/home/presentation/pages/home_page.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  Future<Either<Failure, bool>> _checkToken() async {
    return await sl<VerifyTokenUseCase>().execute(NoParam());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<Either<Failure, bool>>(
      future: _checkToken(),
      builder: (context, snapshot) {
        if (!snapshot.hasData) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return snapshot.data!.fold(
          (_) => const LoginPage(),
          (isLogged) => isLogged ? const HomePage() : const LoginPage(),
        );
      },
    );
  }
}
