import 'package:dartz/dartz.dart';
import 'package:mobile/src/core/network/error/failure.dart';

abstract class UseCase<T, Params> {
  Future<Either<Failure, T>> execute(Params params);
}

class NoParam {}
