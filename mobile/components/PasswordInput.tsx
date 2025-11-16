import { Colors } from "@/styles/variables";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View, ViewStyle } from "react-native";
import AuthenticationInput from "./AuthenticationInput";
import Eye from "./svgs/Eye";
import { ThemedTextInputProps } from "./ThemedTextInput";

export default function PasswordInput({value, setValue, style, ...rest}: ThemedTextInputProps & { style: ViewStyle }) {
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';
    const [showPassword, setShowPassword] = useState<boolean>(false);

    function clickEye() {
        setShowPassword(!showPassword);
    }

    return (
        <View style={[styles.inputContainer]}>
            <AuthenticationInput 
                style={[isDark ? styles.themedInputDark : styles.themedInputLight, { paddingRight: 40 }, style]} 
                value={value} 
                setValue={setValue}
                secureTextEntry={!showPassword}
                placeholderTextColor={isDark ? Colors.dark.inputTextColor : Colors.light.inputTextColor}
                {...rest} 
            />
            <TouchableOpacity style={styles.eyeSvg} onPress={clickEye}>
                <Eye width={24} color={isDark ? 'white' : 'black'} type={showPassword ? "clear" : "slashed"}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        position: 'relative',
    },
    themedInputContainerLight: {
        backgroundColor: Colors.light.inputColor,
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    themedInputContainerDark: {
        backgroundColor: Colors.dark.inputColor,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    themedInputLight: {
        color: 'black',
        fontFamily: 'Rubik-Regular',
    },
    themedInputDark: {
        color: 'white',
        fontFamily: 'Rubik-Regular',
    },
    eyeSvg: {
        width: 24,
        position: 'absolute',
        right: 12,
        top: "50%",
        transform: [{ translateY: -12 }]
    }
})