import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';


@Schema({ timestamps: true })
export class User extends Document {
  
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop({
    default: null,
  })
  cloudinary_id: string;

  @Prop({
    default: null,
  })
  avatar: string;

  @Prop({select:false})
  @Exclude()
  password: string;

  @Prop()
  fullName: string;

  @Prop({
    type: Boolean,
    default: true
  })
  isActive: boolean;

  @Prop({ 
       type:  mongoose.Schema.Types.Array,
       default : ['user']
      })
  roles: string[];
  
}
export const UserSchema = SchemaFactory.createForClass(User);
