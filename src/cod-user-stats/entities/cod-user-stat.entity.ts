import { User } from '../../auth/entities/user.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CodUserStat extends Document {
  @Prop({ default: 0 })
  kills: number;

  @Prop({ default: 0 })
  deaths: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  user: User;
}

export const CodUserStatsShema = SchemaFactory.createForClass(CodUserStat);
