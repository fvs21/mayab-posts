import { ThemedText } from '@/components/ThemedText';
import ThemedView from '@/components/themed-view';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Post as PostType } from '../../types';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle, Repeat2, Heart, Share } from 'lucide-react-native';
import { Colors } from '@/styles/variables';

export default function Post({ post }: { post: PostType }) {
    const time = new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    const iconColor = isDark ? Colors.dark.icon : Colors.light.icon;

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity 
                activeOpacity={0.50} style={styles.row}
                onPress={() => {
                    queryClient.setQueryData(['post', post.id], { post });
                    navigation.push('Post', { id: post.id });
                }}
            >
                <Image
                    source={post.creator.profile_picture ? { uri: post.creator.profile_picture } : undefined}
                    style={styles.avatar}
                />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <ThemedText type="defaultSemiBold" weight="300" style={styles.name}>
                            {post.creator.full_name}
                        </ThemedText>
                        <ThemedText weight="100" style={styles.username}>
                            @{post.creator.username} · {time}
                        </ThemedText>
                    </View>

                    <ThemedText weight="300" style={styles.text}>
                        {post.content}
                    </ThemedText>

                    {post.images && post.images.length > 0 ? (
                        <Image source={{ uri: post.images[0] }} style={styles.postImage} />
                    ) : null}

                    <View style={styles.actions}>
                        <View style={styles.actionItem}>
                            <MessageCircle size={18} color={iconColor} />
                            <ThemedText weight="100" style={styles.actionText}>0</ThemedText>
                        </View>
                        <View style={styles.actionItem}>
                            <Heart size={18} color={iconColor} />
                            <ThemedText weight="100" style={styles.actionText}>0</ThemedText>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1b1b1bff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#cfcfcf',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        marginRight: 8,
    },
    username: {
        color: '#8C8E98',
    },
    text: {
        marginBottom: 8,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 8,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 24,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: '#8C8E98',
    },
});