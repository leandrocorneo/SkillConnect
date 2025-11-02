class LoginApiresponse<T> {
  final T data;

  LoginApiresponse({required this.data});

  static fromJson<T>(Map<String, dynamic> json, Function tFromJson) {
    return LoginApiresponse(data: tFromJson(json['data']));
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }
    if (other is LoginApiresponse) {
      return other.data == data;
    }

    return false;
  }
}
