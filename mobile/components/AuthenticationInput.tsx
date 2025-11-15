import { Colors } from "@/styles/variables";
import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";

export default function AuthenticationInput({placeholder, value, setValue, style, keyboardType, textContentType, ...rest}: ThemedTextInputProps) {
    const [focused, setIsFocused] = useState<boolean>(false);
    const theme = useColorScheme();
    const isDark = theme === 'dark';

    const focus = () => {
        setIsFocused(true);
    }

    const blur = () => {
        setIsFocused(false);
    }

    return (
        <ThemedTextInput
            value={value}
            setValue={setValue}
            style={[style, focused && (isDark ? styles.focusedDark : styles.focusedLight)]}
            textContentType={textContentType}
            keyboardType={keyboardType}
            onFocus={focus}
            onBlur={blur}
            placeholder={placeholder}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    focusedDark: {
        borderColor: Colors.dark.white300
    },
    focusedLight: {
        borderColor: Colors.light.black300
    }
})