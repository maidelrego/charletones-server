import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Module } from '@nestjs/common';
import { Team, TeamSchema } from './entities/team.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Team.name,
        schema: TeamSchema,
      },
    ]),
    CloudinaryModule,
    AuthModule,
  ],
  exports: [TeamsService, MongooseModule],
})
export class TeamsModule {}
