import { IsEmail, IsString, IsEnum, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Roles } from 'src/core/object-value/user-roles.enum';

export class EditProfileDto{

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    @IsOptional()
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(20)
    @IsOptional()
    password: string;

    @IsString()
    @MinLength(11)
    @MaxLength(11)
    @IsOptional()
    @Matches(/^\d{11}$/, { message: 'Document must be exactly 11 digits' }) 
    document: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsEnum(Roles)
    @IsOptional()
    role: Roles;

}