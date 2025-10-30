import { Roles } from 'src/core/object-value/user-roles.enum';

export class RegisterResponseDto {
  id: number;
  name: string;
  email: string;
  imageUrl?: string;
  document: string;
  role: Roles;
  createdAt: Date;
  updatedAt: Date;
}
