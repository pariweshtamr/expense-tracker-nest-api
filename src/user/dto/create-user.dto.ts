import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsLowercase()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(999999)
  readonly pin: number;
}
