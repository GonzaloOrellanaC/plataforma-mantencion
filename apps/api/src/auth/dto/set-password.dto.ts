import { IsNotEmpty, IsString } from 'class-validator';

export class SetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
