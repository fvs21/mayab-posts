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
}