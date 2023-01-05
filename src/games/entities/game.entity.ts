import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Mode } from 'src/modes/entities/mode.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ModeSchema } from '../../modes/entities/mode.entity';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Game  extends Document {

    @Prop({
        type: Boolean,
      })
    win: boolean;

    @Prop({
        type: Boolean,
      })
    argoya: boolean;

    @Prop({ default: 0 })
      kills: number;

    @Prop({default: 0 })
      deaths: number;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Mode.name })
    @Type(() => Mode)
     mode: Mode 

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    @Type(() => User)
     user: User;

}

export const GameSchema = SchemaFactory.createForClass(Game);

