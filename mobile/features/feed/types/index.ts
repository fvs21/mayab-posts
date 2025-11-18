export type Post = {
    id: number;
    content: string;
    creator: {
        id: number;
        username: string;
        profile_picture: string;
        full_name: string;
    };
    created_at: string;
    images?: string[];
    likes_count: number;
    comments_count: number;
    reply_to?: Post;
    is_liked: boolean;
}