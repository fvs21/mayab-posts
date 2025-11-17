import { useLogin } from "@/api/auth";
import AuthenticationInput from "@/components/AuthenticationInput";
import PasswordInput from "@/components/PasswordInput";
import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { flash } from "@/features/flash/core/flash-message-creator";
import { Colors } from "@/styles/variables";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function Login() {
    const isDark = useColorScheme() === "dark";
    const navigation = useNavigation<any>();

    const [username, setUsername] = useState<string>("");  
    const [password, setPassword] = useState<string>("");

    const { login, isPending, loginDisabled } = useLogin(); 

    const handleLogin = async () => {
        try {
            await login({ username, password });
        } catch (error) {
            flash("Incorrect credentials", 3000, "error");
        }
    }
    
    return (
        <ThemedSafeAreaView className={styles.container}>
            <View style={styles.mainLogoContainer}>
                <Image style={styles.mainLogo} source={require('@/assets/images/logo.png')} />
                <ThemedText weight="300" type="title">
                    Join the community
                </ThemedText>
            </View>
            <View style={styles.loginContainer}>
                <View style={styles.loginInputContainer}>
                    <AuthenticationInput 
                        style={styles.loginInput}
                        value={username} 
                        setValue={setUsername} 
                        placeholder="Username or email" 
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <PasswordInput 
                        style={styles.loginInput}
                        value={password} 
                        setValue={setPassword} 
                        placeholder="Password" 
                    />
                    <TouchableOpacity style={styles.logInButton} onPress={handleLogin} disabled={loginDisabled}>
                        <Text style={styles.logInText}>
                            {isPending ? (
                                "Loading..."
                            ) : (
                                "Log In"
                            )}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems: "center"}}> 
                        <ThemedText weight="300" type="default">Forgot your password?</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{padding: 20}}>
                <TouchableOpacity style={[styles.createAccountButton, isDark ? {borderColor: "#fff"} : {borderColor: "#000"}]} onPress={() => navigation.push("Register", { step: 0 })}>
                    <ThemedText weight="300" type="default" style={styles.createAccountText}>
                        Create an account
                    </ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainLogoContainer: {
        height: "35%",
        paddingHorizontal: 20,
        paddingTop: "20%",
    },
    mainLogo: {
        width: 100,
        height: 100,
        objectFit: "contain",
        marginBottom: 10
    },
    loginContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "space-between"
    },
    loginInput: {
        paddingHorizontal: 18,
        paddingVertical: 20,
        borderRadius: 14,
        backgroundColor: "transparent",
        fontSize: 16
    },
    loginInputContainer: {
        gap: 20
    },
    createAccountButton: {
        padding: 10,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderRadius: 30
    },
    createAccountText: {
        textAlign: "center",
        fontSize: 16,
    },
    logInButton: {
        padding: 14,
        borderRadius: 30,
        backgroundColor: Colors.primary300,
        alignItems: "center",
        justifyContent: "center"
    },
    logInText: {
        fontSize: 16,
        color: "white",
        fontFamily: "Rubik-Medium"
    }
});
