class LoginParams {
  final String email;
  final String password;

  LoginParams({required this.email, required this.password});

  LoginParams.fromJson(Map<String, dynamic> json)
    : email = json['email'],
      password = json['password'];

  Map<String, dynamic> toJson() => {'email': email, 'password': password};
}
