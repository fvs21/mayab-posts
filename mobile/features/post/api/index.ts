import { api } from "@/api";
import { DefaultResponse } from "@/types/globals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Post } from "../types";

export const usePost = (id: number) => {
    const { data: post, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: async (): Promise<DefaultResponse<"post", Post>> => {
            const req = await api.get("/post/" + id);
            return req.data.data;
        }, 
    });

    return {
        post,
        isLoading
    }
}

export const usePostComments = (post_id: number) => {
    const { data: comments, isLoading } = useQuery({
        queryKey: ["post", post_id, "comments"],
        queryFn: async (): Promise<DefaultResponse<"data", { replies: Post[] }>> => {
            const req = await api.get("/post/replies/" + post_id);
            return req.data;
        }
    });

    return {
        comments,
        isLoading
    }
}

export const useLikePost = () => {
    const { mutateAsync: like, isPending } = useMutation({
        mutationFn: async (post_id: number): Promise<void> => {
            await api.post("/post/like/" + post_id);
        }
    })

    return {
        like,
        isPending
    }
}