import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:mobile/src/core/utils/injections.dart';
import 'package:mobile/src/features/auth/domain/usecases/login_usecase.dart';
import 'package:mobile/src/features/auth/presentation/bloc/login_bloc.dart';
import 'package:mobile/src/features/auth/presentation/bloc/login_event.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormBuilderState>();

  void _handleLogin() {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      final email = _formKey.currentState!.value['email'];
      final password = _formKey.currentState!.value['password'];

      context.read<LoginBloc>().add(
        LoginSubmitted(email: email, password: password),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginBloc(loginUseCase: sl<LoginUseCase>()),
      child: Scaffold(
        body: Center(
          child: Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Login', style: Theme.of(context).textTheme.headlineLarge),
                const SizedBox(height: 24),
                FormBuilder(
                  key: _formKey,
                  child: Column(
                    children: [
                      FormBuilderTextField(
                        name: 'email',
                        decoration: InputDecoration(labelText: "Email"),
                        validator: FormBuilderValidators.compose([
                          FormBuilderValidators.required(
                            errorText: "Campo obrigatório",
                          ),
                          FormBuilderValidators.email(
                            errorText: "E-mail inválido!",
                          ),
                        ]),
                      ),
                      const SizedBox(height: 16),
                      FormBuilderTextField(
                        name: 'password',
                        obscureText: true,
                        decoration: InputDecoration(labelText: 'Senha'),
                        validator: FormBuilderValidators.compose([
                          FormBuilderValidators.minLength(
                            6,
                            errorText:
                                'A senha deve ter pelo menos 6 caracteres',
                          ),
                          FormBuilderValidators.match(
                            RegExp(r'.*[0-9].*'),
                            errorText:
                                'A senha deve conter pelo menos um número',
                          ),
                          FormBuilderValidators.match(
                            RegExp(r'.*[A-Z].*'),
                            errorText:
                                'A senha deve conter ao menos uma letra maiúscula',
                          ),
                        ]),
                      ),
                      const SizedBox(height: 16),

                      SizedBox(
                        width: double.infinity,
                        child: FloatingActionButton.extended(
                          onPressed: _handleLogin,
                          label: const Text('Login'),
                          icon: const Icon(Icons.login),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
