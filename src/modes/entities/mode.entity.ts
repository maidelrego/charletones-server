import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Mode extends Document {
  @Prop()
  name: string;

  @Prop()
  slug: string;
}

export const ModeSchema = SchemaFactory.createForClass(Mode);
