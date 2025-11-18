export type Post = {
    id: number;
    content: string;
    creator: {
        id: number;
        username: string;
        pfp_url: string;
        full_name: string;
    };
    created_at: string;
    images?: string[];
    like_count: number;
    reply_count: number;
    reply_to?: Post;
    is_liked: boolean;
}