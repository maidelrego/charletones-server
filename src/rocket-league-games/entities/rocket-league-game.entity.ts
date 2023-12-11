import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Team } from 'src/teams/entities/team.entity';

@Schema({ timestamps: true })
export class RocketLeagueGames extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Team })
  @Type(() => Team)
  win: Team;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Team }],
    default: [],
  })
  @Type(() => Team)
  participants: Team[];

  createdAt: Date;
}

export const RocketLeagueGamesShema =
  SchemaFactory.createForClass(RocketLeagueGames);
