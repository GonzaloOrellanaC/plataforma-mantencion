import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  @Get()
  findAll(@Query('companyId') companyId?: string) {
    return this.machinesService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('companyId') companyId?: string) {
    return this.machinesService.findOne(id, companyId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto, @Query('companyId') companyId?: string) {
    return this.machinesService.update(id, updateMachineDto, companyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('companyId') companyId?: string) {
    return this.machinesService.remove(id, companyId);
  }
}
