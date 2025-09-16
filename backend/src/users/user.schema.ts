import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;
export type Role = 'admin' | 'read';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username!: string;

  @Prop({ required: true }) // bcrypt hash
  passwordHash!: string;

  @Prop({ enum: ['admin', 'read'], default: 'read' })
  role!: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);
