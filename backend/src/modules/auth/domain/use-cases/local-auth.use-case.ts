import { Injectable } from '@nestjs/common';
import { FindUserAuthByUseCase } from 'src/modules/users/domain/use-cases/user-auth/find-user-auth-by.use-case';
import { FindUserOneByUseCase } from 'src/modules/users/domain/use-cases/users/find-one-by-id.use-case';
import { HashUtil } from 'src/shared/utils/hash.util';

@Injectable()
export class LocalAuthUseCase {
  constructor(
    private readonly findOneUserByIdUseCase: FindUserOneByUseCase,
    private readonly findUserAuthByUseCase: FindUserAuthByUseCase,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.findOneUserByIdUseCase.execute({ email });
    if (!user) return null;

    const userAuth = await this.findUserAuthByUseCase.execute({
      user_id: user.id, 
    });
    if (!userAuth) return null;

    const isPasswordValid = await HashUtil.compare(
      password,
      userAuth.hash_password,
    );

    if (!isPasswordValid) return null;

    return user;
  }
}