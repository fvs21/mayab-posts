import React from "react";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation, useRoute } from "@react-navigation/native";
import { usePost } from "../../api";
import PostView from "./PostView";

export default function PostScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params as { id: number };
  const { post, isLoading } = usePost(id);

  if (isLoading) {
    return (
      <ThemedSafeAreaView>
        <ThemedText weight="400" style={{ padding: 16 }}>Loading...</ThemedText>
      </ThemedSafeAreaView>
    );
  }

  if (!post) {
    return (
      <ThemedSafeAreaView>
        <ThemedText weight="400" style={{ padding: 16 }}>Post not found 😢</ThemedText>
      </ThemedSafeAreaView>
    );
  }

  const postData = post.post ?? post;

  return <PostView post={postData} onBack={() => navigation.goBack()} />;
}