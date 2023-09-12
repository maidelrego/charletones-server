import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { CodUserStat } from 'src/cod-user-stats/entities/cod-user-stat.entity';
import { Team } from 'src/teams/entities/team.entity';

@Schema({ timestamps: true })
export class CodGame extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Team.name })
  @Type(() => Team)
  win: Team;

  @Prop({ default: null })
  mode: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodUserStat' }],
    default: [],
  })
  @Type(() => CodUserStat)
  participants: CodUserStat[];
}

export const CodGameShema = SchemaFactory.createForClass(CodGame);
