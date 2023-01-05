import { Game } from '../../games/entities/game.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform, Type } from 'class-transformer';
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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game'}],
  })
  @Type(() => Game)
  games: Game;
  
}
export const UserSchema = SchemaFactory.createForClass(User);
