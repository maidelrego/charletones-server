import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CodUserStatsService } from './cod-user-stats.service';
import { CreateCodUserStatDto } from './dto/create-cod-user-stat.dto';

@Controller('cod-user-stats')
export class CodUserStatsController {
  constructor(private readonly codUserStatsService: CodUserStatsService) {}

  @Post()
  create(@Body() createCodUserStatDto: CreateCodUserStatDto) {
    return this.codUserStatsService.create(createCodUserStatDto);
  }

  @Get()
  findAll() {
    return this.codUserStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.codUserStatsService.findOne(+id);
  }
}
