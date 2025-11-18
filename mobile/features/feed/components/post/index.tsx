import { ThemedText } from '@/components/ThemedText';
import ThemedView from '@/components/themed-view';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Post as PostType } from '@/features/post/types';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { MessageCircle, Repeat2, Heart, Share } from 'lucide-react-native';
import { Colors } from '@/styles/variables';
import { useLikePost, useUnlikePost } from '../../api';

export default function Post({ post, show_reply = true }: { post: PostType, show_reply: boolean }) {
    const time = new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    const iconColor = isDark ? Colors.dark.icon : Colors.light.icon;
    
    const likePost = useLikePost();
    const unlikePost = useUnlikePost();

    const handleLikeToggle = (e: any) => {
        e.stopPropagation();
        
        if (post.is_liked) {
            unlikePost.mutate(post.id);
        } else {
            likePost.mutate(post.id);
        }
    };

    if(post.id == 32)
        console.log(post);


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
                    source={post.creator.pfp_url ? { uri: post.creator.pfp_url } : undefined}
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

                    {post.reply_to && show_reply && (
                        <View style={[styles.replyBox, isDark ? styles.replyBoxDark : styles.replyBoxLight]}>
                            <View style={styles.replyHeader}>
                                <Image
                                    source={post.reply_to.creator.pfp_url ? { uri: post.reply_to.creator.pfp_url } : undefined}
                                    style={styles.replyAvatar}
                                />
                                <View style={styles.replyHeaderText}>
                                    <View style={styles.replyHeaderRow}>
                                        <ThemedText weight="300" style={styles.replyName}>
                                            {post.reply_to.creator.full_name}
                                        </ThemedText>
                                        <ThemedText weight="100" style={styles.replyUsername}>
                                            @{post.reply_to.creator.username}
                                        </ThemedText>
                                    </View>
                                    <ThemedText weight="300" style={styles.replyContent} numberOfLines={3}>
                                        {post.reply_to.content}
                                    </ThemedText>
                                    {post.reply_to.images && post.reply_to.images.length > 0 && (
                                        <Image 
                                            source={{ uri: post.reply_to.images[0] }} 
                                            style={styles.replyImage} 
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    )}

                    <ThemedText weight="300" style={styles.text}>
                        {post.content}
                    </ThemedText>

                    {post.images && post.images.length > 0 ? (
                        <Image source={{ uri: post.images[0] }} style={styles.postImage} />
                    ) : null}

                    <View style={styles.actions}>
                        <View style={styles.actionItem}>
                            <MessageCircle size={18} color={iconColor} />
                            <ThemedText weight="100" style={styles.actionText}>{post.reply_count}</ThemedText>
                        </View>
                        <TouchableOpacity style={styles.actionItem} onPress={handleLikeToggle}>
                            <Heart 
                                size={18} 
                                color={post.is_liked ? Colors.danger : iconColor}
                                fill={post.is_liked ? Colors.danger : 'none'}
                            />
                            <ThemedText weight="100" style={[styles.actionText, post.is_liked && styles.likedText]}>
                                {post.like_count}
                            </ThemedText>
                        </TouchableOpacity>
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
    replyBox: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        marginTop: 4,
    },
    replyBoxLight: {
        borderColor: Colors.light.border,
        backgroundColor: '#f7f7f7',
    },
    replyBoxDark: {
        borderColor: Colors.dark.border,
        backgroundColor: '#16181c',
    },
    replyHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    replyAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#cfcfcf',
        marginRight: 8,
    },
    replyHeaderText: {
        flex: 1,
    },
    replyHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        gap: 6,
    },
    replyName: {
        fontSize: 14,
        fontFamily: 'Rubik-Medium',
    },
    replyUsername: {
        fontSize: 13,
        color: '#8C8E98',
    },
    replyContent: {
        fontSize: 14,
        lineHeight: 18,
        color: '#8C8E98',
    },
    replyImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginTop: 8,
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
    likedText: {
        color: Colors.danger,
    },
});