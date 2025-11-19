import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsArray()
  permissions?: string[];

  @IsOptional()
  @IsString()
  companyId?: string;
}
