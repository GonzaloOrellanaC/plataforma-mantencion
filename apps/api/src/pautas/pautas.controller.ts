import { Controller, Post, Body, UseGuards, Get, Param, Query, Put, Delete } from '@nestjs/common';
import { PautasService } from './pautas.service';
import { CreatePautaDto } from './dto/create-pauta.dto';
import { UpdatePautaDto } from './dto/update-pauta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pautas')
export class PautasController {
  constructor(private pautasService: PautasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePautaDto) {
    return this.pautasService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.pautasService.findAll(companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.pautasService.findOne(id, companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Query('companyId') companyId: string, @Body() dto: UpdatePautaDto) {
    return this.pautasService.update(id, companyId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Query('companyId') companyId: string) {
    return this.pautasService.remove(id, companyId);
  }
}
