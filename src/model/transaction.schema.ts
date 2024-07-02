import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../auth/schemas/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  amount: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: User;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
