import { Injectable } from '@nestjs/common';
import { UsersGatewayInterface } from './users.gateway.interface';
import { User } from 'src/core/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersGatewayTypeorm implements UsersGatewayInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
      return this.userRepository.find({
        select: {
          id: true,
          name: true,
          email: true,
          document: true,
          role: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          userAuth: {
            id: true,
            user_id: true,
            created_at: true,
            updated_at: true
          }
        }
      });
    }

  async findOneBy(where: Partial<User>): Promise<User | null> {
    return this.userRepository.findOne({ 
      where,
      relations: ['userAuth']
    });
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.save(user);
  }
}