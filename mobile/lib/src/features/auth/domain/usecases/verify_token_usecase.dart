import 'package:dartz/dartz.dart';
import 'package:mobile/src/core/network/error/failure.dart';
import 'package:mobile/src/core/utils/usecases/usecase.dart';
import 'package:mobile/src/features/auth/domain/repositories/abstract_login_repository.dart';

class VerifyTokenUseCase extends UseCase<bool, NoParam> {
  final AbstractLoginRepository abstractLoginRepository;

  VerifyTokenUseCase(this.abstractLoginRepository);

  @override
  Future<Either<Failure, bool>> execute(NoParam params) async {
    final result = await abstractLoginRepository.verifyToken();

    return result.fold((l) => Left(l), (r) => Right(r));
  }
}
