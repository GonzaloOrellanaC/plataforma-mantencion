import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreatePautaDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  schemaVersion?: string;

  @IsOptional()
  @IsNumber()
  version?: number;

  @IsOptional()
  @IsArray()
  fields?: any[];

  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @IsOptional()
  @IsString()
  createdBy?: string;
}
