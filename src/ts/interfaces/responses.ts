export interface Feed {
    username: string;
    following: Array<{
        username: string;
        posts: Array<{
            content: string;
            postId: any;
        }>
    }>
}