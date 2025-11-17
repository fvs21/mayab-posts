import Header from "@/features/feed/components/header";
import FeedTimeline from "@/features/feed/components/timeline/FeedTimeline";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { PlusIcon } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function Feed() { 
    const navigate = useNavigation<any>();

    return (
        <Header>
            <View style={{ flex: 1, position: 'relative' }}>
                <FeedTimeline />
                <TouchableOpacity style={styles.createPostBtn} onPress={() => navigate.navigate('CreatePost')}>
                    <PlusIcon color="#fff" size={32} />
                </TouchableOpacity>
            </View>
        </Header>
    )
}

const styles = StyleSheet.create({
    createPostBtn: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1E90FF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})