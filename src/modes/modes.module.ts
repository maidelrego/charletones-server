import { Module } from '@nestjs/common';
import { ModesService } from './modes.service';
import { ModesController } from './modes.controller';
import { Mode, ModeSchema } from './entities/mode.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ModesController],
  providers: [ModesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Mode.name,
        schema: ModeSchema,
      },
    ]),
  ],
  exports: [ModesService,MongooseModule]
})
export class ModesModule {}
