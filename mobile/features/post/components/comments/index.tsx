import { View } from "react-native";
import { usePostComments } from "../../api";
import Post from "@/features/feed/components/post";

export default function Comments({ post_id }: { post_id: number }) {
    const { comments, isLoading } = usePostComments(post_id);

    if (isLoading) {
        return <View />
    }

    return (
        <View style={{ flex: 1, borderTopColor: '#393939ff', borderTopWidth: 1, paddingTop: 8 }}>
            {comments?.data.replies.map(c => (<Post key={c.id} post={c} show_reply={false} />))}
        </View>
    );
}