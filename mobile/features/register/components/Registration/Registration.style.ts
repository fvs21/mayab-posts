import { Colors } from "@/styles/variables";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    header: {
        gap: 30,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flex: 1,
        justifyContent: "space-between"
    },
    input: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: 14,
        backgroundColor: "transparent",
        fontSize: 16
    },
    continueButton: {
        padding: 18,
        backgroundColor: Colors.primary300,
        borderRadius: 30
    },
    continueButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontFamily: "Rubik-Medium"
    },
    usernameInputContainer: {
        position: "relative"
    }
});

export default styles;