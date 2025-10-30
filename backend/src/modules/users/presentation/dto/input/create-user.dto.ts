import { IsEmail, IsString, IsEnum, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Roles } from 'src/core/object-value/user-roles.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'Document must be exactly 11 digits' })
  document: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsEnum(Roles)
  role: Roles;
}
