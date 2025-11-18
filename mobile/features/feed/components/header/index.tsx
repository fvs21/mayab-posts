import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "@/api/auth/store";

export default function Header({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const [token, setToken] = useToken();

    return (
        <ThemedSafeAreaView>
            <View style={styles.header}> 
                <TouchableOpacity 
                    style={styles.pfpButton}
                    onPress={async () => {
                        console.log("Logging out");
                        await SecureStore.deleteItemAsync('token');
                        queryClient.clear();
                        setToken(null);
                    }}
                >
                    <Image style={styles.pfp} source={{ uri: 'https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg?nii=t' }} />
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