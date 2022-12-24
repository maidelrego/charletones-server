import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './entities/player.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [PlayerController],
  providers: [PlayerService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Player.name,
        schema: PlayerSchema,
      },
    ]),
    ConfigModule
  ],
  exports: [MongooseModule],
})
export class PlayerModule {}
