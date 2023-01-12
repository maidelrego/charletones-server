import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ModesService } from './modes.service';
import { CreateModeDto } from './dto/create-mode.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';

@Controller('modes')
export class ModesController {
  constructor(private readonly modesService: ModesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createModeDto: CreateModeDto) {
    return this.modesService.create(createModeDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() paginationDto: PaginationDto) {
    return this.modesService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id',ParseMongoIdPipe) id: string) {
    return this.modesService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateModeDto: UpdateModeDto) {
  //   return this.modesService.update(+id, updateModeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.modesService.remove(+id);
  // }
}
