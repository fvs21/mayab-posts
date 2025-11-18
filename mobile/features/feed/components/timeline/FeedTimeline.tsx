import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useFeed } from "../../api";
import Post from "../post";

export default function FeedTimeline() {
    const { feed, isLoading, refetch, isRefetching } = useFeed();

    if (isLoading) {
        return <View />;
    }

    return (
        <View style={styles.container}>
            <FlatList 
                data={feed?.posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <Post post={item} show_reply />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%'
    }
})