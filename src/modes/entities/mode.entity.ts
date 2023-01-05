import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Mode  extends Document {

@Prop()
name: string;

@Prop()
slug: string;

// @BeforeInsert()
// checkEmailBeforeInsert() {
//   this.slug = this.name.split(' ').join('_').toLowerCase();
// }

}

export const ModeSchema = SchemaFactory.createForClass(Mode);

