import { PartialType } from '@nestjs/mapped-types';
import { CreatePautaDto } from './create-pauta.dto';

export class UpdatePautaDto extends PartialType(CreatePautaDto) {}
