import { api } from "@/api";
import { DefaultResponse } from "@/types/globals";
import { useQuery } from "@tanstack/react-query";
import { Post } from "../types";

export const useFeed = () => {
    const { data: feed, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["feed"],
        queryFn: async (): Promise<DefaultResponse<"posts", Post[]>> => {
            const req = await api.get("/post/feed");
            
            return req.data.data;
        }, 
    });

    return {
        feed,
        isLoading,
        refetch,
        isRefetching
    }
}

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