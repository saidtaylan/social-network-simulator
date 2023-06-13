import { Types } from "mongoose";

export interface Feed {
    username: string;
    following: Array<{
        username: string;
        posts: Array<{
            content: string;
            postId: Types.ObjectId;
        }>
    }>
}