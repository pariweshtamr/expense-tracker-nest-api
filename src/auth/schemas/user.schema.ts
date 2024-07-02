import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
  @Prop({ required: true })
  password: string;
}

export type UserDocument = HydratedDocument<User>; // a way to create mongodb document from a raw js object
export const UserSchema = SchemaFactory.createForClass(User);
