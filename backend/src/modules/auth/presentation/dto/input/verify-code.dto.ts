import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyCodeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    @Matches(/^[1-9]{6}$/)
    code: string;
}
