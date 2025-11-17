import { Colors } from "@/styles/variables";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainLogoContainer: {
        height: "35%",
        paddingHorizontal: 20
    },
    mainLogo: {
        width: 150,
        height: 150,
        objectFit: "contain"
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

export default styles;