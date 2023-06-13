import { Schema, model, Types, Document } from 'mongoose'

export interface IPost extends Document {
  content: string
  user: Types.ObjectId
  likes: Types.ObjectId[]
  retweet: Types.ObjectId[]
  deleted_at: Date
}

const schema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
  ],

  retweet: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
  ],

  deleted_at: Date,
},
  {
    timestamps: true,
    versionKey: false,
  },
)

export const PostModel = model<IPost>('Post', schema);
