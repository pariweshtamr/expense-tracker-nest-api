import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsLowercase()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  readonly pin: number;
}
