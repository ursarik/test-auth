import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from '../constants';

export class SignUpDto {
  @MaxLength(EMAIL_MAX_LENGTH)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @IsString()
  @IsNotEmpty()
  password: string;
}
