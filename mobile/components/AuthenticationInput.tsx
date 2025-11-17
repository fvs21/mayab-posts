import { Colors } from "@/styles/variables";
import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";

type AuthenticationInputProps = ThemedTextInputProps & {
    setFocused?: (focused: boolean) => void;
}

export default function AuthenticationInput({placeholder, value, setValue, style, keyboardType, textContentType, setFocused, ...rest}: AuthenticationInputProps) {
    const [focused, setIsFocused] = useState<boolean>(false);
    const theme = useColorScheme();
    const isDark = theme === 'dark';

    const focus = () => {
        setIsFocused(true);
        setFocused && setFocused(true);
    }

    const blur = () => {
        setIsFocused(false);
        setFocused && setFocused(false);
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