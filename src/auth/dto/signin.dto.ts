import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;
  @IsString()
  @Matches(/^(?=.*\d)/, {
    message: 'Password must contain at least one number!',
  })
  password: string;
}
