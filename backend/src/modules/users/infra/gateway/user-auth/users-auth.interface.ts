import { UserAuth } from 'src/core/entities/user-auth.entity';

export interface UsersAuthGatewayInterface {
  findOneBy(where: Partial<UserAuth>): Promise<UserAuth | null>;
  create(userAuth: Partial<UserAuth>): Promise<UserAuth>;
  update(id: number, userAuth: Partial<UserAuth>): Promise<void>;
}