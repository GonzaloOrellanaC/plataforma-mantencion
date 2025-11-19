import { IsString, IsOptional } from 'class-validator';

export class CreateMachineDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
