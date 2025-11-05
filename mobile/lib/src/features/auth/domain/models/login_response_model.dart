class LoginApiResponse<T> {
  final T data;

  LoginApiResponse({required this.data});

  factory LoginApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) fromJsonT,
  ) {
    return LoginApiResponse<T>(
      data: fromJsonT(json['data'] as Map<String, dynamic>),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) {
      return true;
    }
    if (other.runtimeType != runtimeType) {
      return false;
    }
    if (other is LoginApiResponse) {
      return other.data == data;
    }

    return false;
  }
}
