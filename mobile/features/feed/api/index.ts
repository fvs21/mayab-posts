import { api } from "@/api";
import { DefaultResponse } from "@/types/globals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/features/post/types";

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

export const useLikePost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (postId: number) => {
            const response = await api.post(`/post/${postId}/like`);
            return response.data;
        },
        onMutate: async (postId: number) => {
            await queryClient.cancelQueries({ queryKey: ["feed"] });
            await queryClient.cancelQueries({ queryKey: ["post", postId] });

            const previousFeed = queryClient.getQueryData(["feed"]);
            const previousPost = queryClient.getQueryData(["post", postId]);

            queryClient.setQueryData(["feed"], (old: any) => {
                if (!old?.posts) return old;
                return {
                    ...old,
                    posts: old.posts.map((post: Post) =>
                        post.id === postId
                            ? { ...post, is_liked: true, like_count: post.like_count + 1 }
                            : post
                    )
                };
            });

            queryClient.setQueryData(["post", postId], (old: any) => {
                if (!old?.post) return old;
                return {
                    ...old,
                    post: { ...old.post, is_liked: true, like_count: old.post.like_count + 1 }
                };
            });

            return { previousFeed, previousPost };
        },
        onError: (err, postId, context) => {
            if (context?.previousFeed) {
                queryClient.setQueryData(["feed"], context.previousFeed);
            }
            if (context?.previousPost) {
                queryClient.setQueryData(["post", postId], context.previousPost);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["post"] });
        }
    });
}

export const useUnlikePost = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (postId: number) => {
            const response = await api.delete(`/post/${postId}/unlike`);
            return response.data;
        },
        onMutate: async (postId: number) => {
            await queryClient.cancelQueries({ queryKey: ["feed"] });
            await queryClient.cancelQueries({ queryKey: ["post", postId] });

            const previousFeed = queryClient.getQueryData(["feed"]);
            const previousPost = queryClient.getQueryData(["post", postId]);

            queryClient.setQueryData(["feed"], (old: any) => {
                if (!old?.posts) return old;
                return {
                    ...old,
                    posts: old.posts.map((post: Post) =>
                        post.id === postId
                            ? { ...post, is_liked: false, like_count: post.like_count - 1 }
                            : post
                    )
                };
            });

            queryClient.setQueryData(["post", postId], (old: any) => {
                if (!old?.post) return old;
                return {
                    ...old,
                    post: { ...old.post, is_liked: false, like_count: old.post.like_count - 1 }
                };
            });

            return { previousFeed, previousPost };
        },
        onError: (err, postId, context) => {
            if (context?.previousFeed) {
                queryClient.setQueryData(["feed"], context.previousFeed);
            }
            if (context?.previousPost) {
                queryClient.setQueryData(["post", postId], context.previousPost);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["feed"] });
            queryClient.invalidateQueries({ queryKey: ["post"] });
        }
    });
}