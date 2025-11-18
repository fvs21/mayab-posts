import { apiMultiPart } from "@/api";
import { Post } from "@/features/feed/types";
import { DefaultResponse } from "@/types/globals";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SelectedImage } from "../types";

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: create, isPending } = useMutation({
        mutationFn: async (data: { content: string; images: SelectedImage[], reply_to?: number }): Promise<DefaultResponse<"data", Post>> => {
            const formData = new FormData();
            formData.append('data', JSON.stringify({ content: data.content, reply_to_post_id: data.reply_to }));

            data.images.forEach((image, index) => {
                formData.append('image' + index, {
                    uri: image.uri,
                    name: image.filename,
                    type: image.type
                } as any);
            });

            const req = await apiMultiPart.post('/post/', formData);
            return req.data;
        },
        onSuccess: (data: DefaultResponse<"data", Post>) => {
            queryClient.setQueryData(['post', data.data.id], data.data);
            queryClient.invalidateQueries({ queryKey: ['feed'] });

            if(data.data.reply_to) {
                queryClient.invalidateQueries({ queryKey: ['post', data.data.reply_to.id, 'comments'] });
            }
        }
    });

    return { createPost: create, isPending };
}