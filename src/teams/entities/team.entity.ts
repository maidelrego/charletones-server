import { User } from '../../auth/entities/user.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Mode } from 'src/modes/entities/mode.entity';

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({
    unique: true,
  })
  name: string;

  @Prop({
    default: null,
  })
  cloudinary_id: string;

  @Prop({
    default: null,
  })
  avatar: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mode' }],
    default: [],
  })
  @Type(() => Mode)
  mode: Mode[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  @Type(() => User)
  members: User[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);
