import { Colors } from "@/styles/variables";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type DisabledButtonProps = {
    text: string;
    click: () => void;
    style?: Object | Object[];
    disabled: boolean;
}

export default function PrimaryDisabledButton({text, click, style, disabled}: DisabledButtonProps) {
    return (
        <TouchableOpacity onPress={click} style={[styles.primaryButton, style, disabled && styles.disabled]} disabled={disabled}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Rubik-Medium",
        textAlign: "center",
        color: "white",
        fontSize: 18,
    },
    primaryButton: {
        width: "100%",
        padding: 16,
        borderRadius: 30,
        backgroundColor: Colors.primary300
    },
    disabled: {
        opacity: 0.6
    }
})