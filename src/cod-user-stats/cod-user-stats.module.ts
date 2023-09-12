import { Module } from '@nestjs/common';
import { CodUserStatsService } from './cod-user-stats.service';
import { CodUserStatsController } from './cod-user-stats.controller';
import {
  CodUserStat,
  CodUserStatsShema,
} from './entities/cod-user-stat.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CodUserStatsController],
  providers: [CodUserStatsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: CodUserStat.name,
        schema: CodUserStatsShema,
      },
    ]),
  ],
  exports: [CodUserStatsService, MongooseModule],
})
export class CodUserStatsModule {}
