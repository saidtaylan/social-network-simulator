import { Schema, model, Types, Document } from 'mongoose'
import { Post } from './post';

export interface User extends Document {
  username: string
  email: string
  password: string
  following: Types.ObjectId[]
  follower: Types.ObjectId[]
  deleted_at: Date
}

const schema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
    ],
    follower: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
    ],
    deleted_at: Date,
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = model<User>('User', schema);
