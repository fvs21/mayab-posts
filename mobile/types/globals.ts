export type SVGProps = {
    width: number;
    color?: string;
}

export type DefaultResponse<QueryKey extends string, T> = {
    [key in QueryKey]: T;
} & {
    error: boolean;
    code?: string;
    detail?: unknown;
}

export type User = {
    id: number;
    full_name: string;
    username: string;
    email: string;
    bio: string | null;
    pfp_url: string | null;
    banner_url: string | null;
}

