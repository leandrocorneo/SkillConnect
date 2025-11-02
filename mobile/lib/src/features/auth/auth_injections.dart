import 'package:mobile/src/core/network/dio_network.dart';
import 'package:mobile/src/core/utils/injections.dart';
import 'package:mobile/src/features/auth/data/data_source/remote/login_impl_api.dart';
import 'package:mobile/src/features/auth/data/repositories/login_repo_impl.dart';
import 'package:mobile/src/features/auth/domain/repositories/abstract_login_repository.dart';
import 'package:mobile/src/features/auth/domain/usecases/login_usecase.dart';

initAuthInjections() {
  sl.registerSingleton<LoginImplApi>(LoginImplApi(DioNetwork.appApi));
  sl.registerSingleton<AbstractLoginRepository>(LoginRepoImpl(sl()));
  sl.registerSingleton<LoginUseCase>(LoginUseCase(sl()));
}
