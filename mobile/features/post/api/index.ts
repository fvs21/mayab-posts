import { api } from "@/api";
import { DefaultResponse } from "@/types/globals";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../types";

export const usePost = (id: number) => {
    const { data: post, isLoading } = useQuery({
        queryKey: ["post", id],
        queryFn: async (): Promise<DefaultResponse<"post", Post>> => {
            const req = await api.get("/post/" + id);
            return req.data;
        }, 
    });

    return {
        post,
        isLoading
    }
}