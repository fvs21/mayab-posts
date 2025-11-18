import ThemedView from "@/components/themed-view";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, useColorScheme, ScrollView, Image, Alert, Platform, InputAccessoryView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { Colors } from "@/styles/variables";
import { useNavigation } from "expo-router";
import XLgSVG from "@/components/svgs/XLg";
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { useCreatePost } from "@/features/create-post/api";
import { flash } from "@/features/flash/core/flash-message-creator";
import { SelectedImage } from "@/features/create-post/types";

export default function CreatePost({ route }: any) {
    const [postText, setPostText] = useState('');
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    const navigation = useNavigation();
    const MAX_CHARS = 280;

    const reply_to = route.params?.replyTo as number | undefined;

    const { createPost, isPending } = useCreatePost();

    const pickImageFromGallery = async () => {
        if (selectedImages.length >= 4) {
            Alert.alert('Limit Reached', 'You can only add up to 4 images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            selectionLimit: 4 - selectedImages.length,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset: ImagePicker.ImagePickerAsset) => ({
                uri: asset.uri,
                filename: asset.fileName ?? 'photo.jpg',
                type: asset.type ?? 'image/jpeg',
            }));
            setSelectedImages([...selectedImages, ...newImages]);
        }
    };

    const takePhoto = async () => {
        if (selectedImages.length >= 4) {
            Alert.alert('Limit Reached', 'You can only add up to 4 images');
            return;
        }

        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera permission is required to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, {
                uri: result.assets[0].uri,
                filename: result.assets[0].fileName ?? 'photo.jpg',
                type: result.assets[0].type ?? 'image/jpeg',
            }]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (!postText.trim() && selectedImages.length === 0) {
            Alert.alert('Empty Post', 'Please add some text or images');
            return;
        }

        try {
            await createPost({ content: postText.trim(), images: selectedImages, reply_to });
            navigation.goBack();
        } catch (error) {
            flash('Failed to create post. Please try again.', 3000, 'error');
        }
    };

    const canPost = (postText.trim().length > 0 || selectedImages.length > 0) && postText.length <= MAX_CHARS && !isPending;
    const remainingChars = MAX_CHARS - postText.length;
    const isOverLimit = remainingChars < 0;

    const inputAccessoryViewID = 'uniqueID';

    return (
        <ThemedView className={{ flex: 1 }}>
            <View style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <XLgSVG width={22} color={isDark ? 'white' : 'black'} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handlePost}
                    disabled={!canPost}
                    style={[styles.postButton, !canPost && styles.postButtonDisabled]}
                >
                    {isPending ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={[styles.postButtonText, !canPost && styles.postButtonTextDisabled]}>
                            Post
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    style={[
                        styles.textInput,
                        isDark ? styles.textInputDark : styles.textInputLight
                    ]}
                    placeholder="What's happening?"
                    placeholderTextColor={isDark ? Colors.dark.inputTextColor : Colors.light.inputTextColor}
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                    maxLength={MAX_CHARS + 50}
                    autoFocus
                    inputAccessoryViewID={inputAccessoryViewID}
                />

                {postText.length > 0 && (
                    <View style={styles.charCounterContainer}>
                        <Text style={[
                            styles.charCounter,
                            isOverLimit && styles.charCounterError
                        ]}>
                            {remainingChars}
                        </Text>
                    </View>
                )}

                {selectedImages.length > 0 && (
                    <View style={styles.imageGrid}>
                        {selectedImages.map((uri, index) => (
                            <View key={index} style={[
                                styles.imageContainer,
                                selectedImages.length === 1 && styles.imageContainerSingle,
                                selectedImages.length === 2 && styles.imageContainerDouble,
                                selectedImages.length >= 3 && styles.imageContainerMultiple
                            ]}>
                                <Image source={{ uri: uri.uri }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <XLgSVG width={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Camera and Gallery Buttons - Above Keyboard */}
            {Platform.OS === 'ios' ? (
                <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <View style={[styles.bottomToolbar, isDark ? styles.bottomToolbarDark : styles.bottomToolbarLight]}>
                        <TouchableOpacity
                            style={styles.mediaButton}
                            onPress={takePhoto}
                            disabled={selectedImages.length >= 4}
                        >
                            <Camera size={22} color={isDark ? Colors.dark.icon : Colors.light.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.mediaButton}
                            onPress={pickImageFromGallery}
                            disabled={selectedImages.length >= 4}
                        >
                            <ImageIcon size={22} color={isDark ? Colors.dark.icon : Colors.light.icon} />
                        </TouchableOpacity>
                    </View>
                </InputAccessoryView>
            ) : (
                <View style={[styles.bottomToolbar, isDark ? styles.bottomToolbarDark : styles.bottomToolbarLight]}>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={takePhoto}
                        disabled={selectedImages.length >= 4}
                    >
                        <Camera size={22} color={isDark ? Colors.dark.icon : Colors.light.icon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={pickImageFromGallery}
                        disabled={selectedImages.length >= 4}
                    >
                        <ImageIcon size={22} color={isDark ? Colors.dark.icon : Colors.light.icon} />
                    </TouchableOpacity>
                </View>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerLight: {
        borderBottomColor: Colors.light.border,
    },
    headerDark: {
        borderBottomColor: Colors.dark.border,
    },
    closeButton: {
        padding: 4,
    },
    postButton: {
        backgroundColor: Colors.primary300,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonDisabled: {
        opacity: 0.5,
    },
    postButtonText: {
        color: 'white',
        fontFamily: 'Rubik-Bold',
        fontSize: 15,
    },
    postButtonTextDisabled: {
        opacity: 0.7,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingBottom: 16,
    },
    textInput: {
        fontSize: 18,
        fontFamily: 'Rubik-Regular',
        minHeight: 120,
        paddingTop: 16,
        textAlignVertical: 'top',
    },
    textInputLight: {
        color: Colors.light.black300,
    },
    textInputDark: {
        color: Colors.dark.white,
    },
    charCounterContainer: {
        alignItems: 'flex-end',
        paddingRight: 8,
        marginBottom: 12,
    },
    charCounter: {
        fontSize: 14,
        fontFamily: 'Rubik-Regular',
        color: Colors.light.black100,
    },
    charCounterError: {
        color: Colors.danger,
        fontFamily: 'Rubik-Bold',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginVertical: 12,
    },
    imageContainer: {
        position: 'relative',
        borderRadius: 12,
        overflow: 'hidden',
    },
    imageContainerSingle: {
        width: '100%',
        height: 300,
    },
    imageContainerDouble: {
        width: '48%',
        height: 200,
    },
    imageContainerMultiple: {
        width: '48%',
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 20,
        padding: 6,
    },
    bottomToolbar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 8,
        borderTopWidth: 1,
    },
    bottomToolbarLight: {
        backgroundColor: Colors.light.background,
        borderTopColor: Colors.light.border,
    },
    bottomToolbarDark: {
        backgroundColor: Colors.dark.background,
        borderTopColor: Colors.dark.border,
    },
    mediaButton: {
        padding: 8,
        borderRadius: 20,
    },
});