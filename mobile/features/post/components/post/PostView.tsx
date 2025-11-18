import { Post } from "../../types";
import React from "react";
import { Dimensions, Image, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";

type Props = {
  post: Post;
  onBack?: () => void;
  showHeader?: boolean;
};

export default function PostView({ post, onBack, showHeader = true }: Props) {
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = windowWidth - 32; // account for horizontal padding (16 + 16)
  const windowHeight = Dimensions.get('window').height;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const createdAtText = new Date(post.created_at).toLocaleString();
  return (
    <ThemedSafeAreaView>
      {showHeader && (
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <ThemedText weight="400" style={styles.backButton}>← Back</ThemedText>
          </TouchableOpacity>
          <View pointerEvents="none" style={styles.headerTitleContainer}>
            <ThemedText type="defaultSemiBold" weight="600" style={styles.headerTitleText}>
              Post
            </ThemedText>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <Image
            source={post.creator.profile_picture ? { uri: post.creator.profile_picture } : undefined}
            style={styles.avatar}
          />
          <View style={styles.authorRow}>
            <ThemedText type="defaultSemiBold" weight="600" style={styles.name}>
              {post.creator.full_name}
            </ThemedText>
            <ThemedText weight="400" style={styles.usernameInline}>
              @{post.creator.username}
            </ThemedText>
          </View>
        </View>

        <ThemedText weight="400" style={styles.text}>{post.content}</ThemedText>

        {post.images && post.images.length > 0 && (() => {
          const images = post.images || [];
          const count = images.length;
          if (count === 1) {
            return (
              <TouchableOpacity activeOpacity={0.9} onPress={() => { setActiveImage(images[0]); setModalVisible(true); }}>
                <Image source={{ uri: images[0] }} style={[styles.postImageSingle, { width: imageWidth }]} resizeMode="cover" />
              </TouchableOpacity>
            );
          }

          if (count === 2) {
            return (
              <View style={[styles.twoRow, { width: imageWidth }]}> 
                {images.map((uri, i) => (
                  <TouchableOpacity key={i} activeOpacity={0.9} style={[styles.twoItem, i === 0 ? { marginRight: 8 } : { marginLeft: 8 }]} onPress={() => { setActiveImage(uri); setModalVisible(true); }}>
                    <Image source={{ uri }} style={styles.twoImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </View>
            );
          }

          // 3 or 4 (grid), or >4 (show first 3 and overlay on 4th)
          const cellSize = (imageWidth - 8) / 2; // 8px total gap
          return (
            <View style={[styles.grid, { width: imageWidth }]}> 
              {[0,1,2,3].map((idx) => {
                const uri = images[idx];
                const isOverlay = idx === 3 && images.length > 4;
                const showPlaceholder = !uri && idx >= images.length;

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.9}
                    style={[styles.gridCell, { width: cellSize, height: cellSize }]}
                    onPress={() => {
                      if (uri) {
                        setActiveImage(uri);
                        setModalVisible(true);
                      }
                    }}
                  >
                    {uri ? (
                      <Image source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                    ) : (
                      <View style={styles.gridEmpty} />
                    )}

                    {isOverlay && (
                      <View style={styles.overlay}>
                        <ThemedText weight="600" style={styles.overlayText}>+{images.length - 3}</ThemedText>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })()}

        <View style={styles.commentsHeader}>
          <ThemedText weight="400" style={styles.dateText}>{createdAtText}</ThemedText>
        </View>

        <View style={styles.actions}>
          <ThemedText weight="400" style={styles.action}>💬 0</ThemedText>
          <ThemedText weight="400" style={styles.action}>🔁 0</ThemedText>
          <ThemedText weight="400" style={styles.action}>❤️ 0</ThemedText>
          <ThemedText weight="400" style={styles.action}>🔗</ThemedText>
        </View>
      </ScrollView>

      {/* Fullscreen image modal */}
      <Modal visible={modalVisible} animationType="fade" transparent={false} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
            <ThemedText weight="600" style={{ color: '#fff' }}>Close</ThemedText>
          </TouchableOpacity>

          <ScrollView
            maximumZoomScale={3}
            minimumZoomScale={1}
            contentContainerStyle={styles.modalScroll}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
          >
            {activeImage ? (
              <Image source={{ uri: activeImage }} style={{ width: windowWidth, height: windowHeight, resizeMode: 'contain' }} />
            ) : null}
          </ScrollView>
        </View>
      </Modal>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#4f4f4f",
  },
  backButton: {
    fontSize: 18,
    marginRight: 12,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#cfcfcf",
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
    color: '#fff',
  },
  username: {
    color: "#bfc1c6",
    fontSize: 14,
  },
  usernameInline: {
    color: "#bfc1c6",
    fontSize: 14,
    marginLeft: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
    color: '#fff',
    textAlign: 'left',
  },
  imagesScroll: {
    marginBottom: 12,
  },
  postImage: {
    width: 320,
    height: 250,
    borderRadius: 12,
    marginRight: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    paddingHorizontal: 8,
  },
  action: {
    fontSize: 16,
    color: '#fff',
    paddingHorizontal: 12,
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  
  dateText: {
    color: '#bfc1c6',
    marginRight: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
  },
  modalScroll: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postImageSingle: {
    height: 320,
    borderRadius: 12,
    marginBottom: 12,
  },
  twoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  twoItem: {
    flex: 1,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
  },
  twoImage: {
    width: '100%',
    height: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCell: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    backgroundColor: '#1f1f1f',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridEmpty: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1f1f1f',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 24,
  },
});
