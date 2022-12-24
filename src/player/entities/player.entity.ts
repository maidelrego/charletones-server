import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true})
export class Player extends Document {
 
  @Prop({
    required: true
  })
  name: string;

  @Prop({
    default: 0
  })
  total_team_wins: number;

  @Prop({
    default: 0
  })
  total_alone_wins: number;

  @Prop({
    default: 0
  })
  total_team_loses: number;

  @Prop({
    default: 0
  })
  total_alone_loses: number;

  @Prop({
    default: null
  })
  cloudinary_id: string;

  @Prop({
    required: null
  })
  avatar: string;

  @Prop({
    default: 0
  })
  total_kill: number;

  @Prop({
    default: 0
  })
  total_deads: number;

  @Prop({
    default: false
  })
  playerType: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
