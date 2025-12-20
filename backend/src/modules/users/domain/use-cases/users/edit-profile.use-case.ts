import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { User } from "src/core/entities/user.entity";
import { UsersGatewayInterface } from "src/modules/users/infra/gateway/user/users.gateway.interface";

@Injectable()
export class EditProfileUseCase {
  constructor(
    @Inject('UsersGatewayInterface')
    private readonly usersGateway: UsersGatewayInterface,
  ) {}

  async execute(User: Partial<User>, userId: number): Promise<User> {
    if(User.id !== userId) {
      throw new ForbiddenException('You can only edit your own profile');
    }

    return this.usersGateway.update(User);
  }
}