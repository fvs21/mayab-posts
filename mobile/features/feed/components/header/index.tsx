import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Header({ children }: { children: React.ReactNode }) {
    return (
        <ThemedSafeAreaView>
            <View style={styles.header}> 
                <TouchableOpacity style={styles.pfpButton}>
                    <Image style={styles.pfp} source={{ uri: 'https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-1.jpg' }} />
                </TouchableOpacity>
                <View>
                    <Image style={styles.mainLogo} source={require('@/assets/images/logo.png')} />
                </View>
                <View style={{ flex: 1 }}/>
            </View>
            <View style={{ flex: 1 }}>
                {children}
            </View>
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14
    },
    mainLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: 10
    },
    pfpButton: {
        flex: 1,
        alignItems: 'flex-start',
    },
    pfp: {
        width: 35,
        height: 35,
        borderRadius: 50,
        resizeMode: 'cover'
    }
})