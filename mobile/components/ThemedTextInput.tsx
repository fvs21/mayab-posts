import { Colors } from '@/styles/variables';
import React from 'react';
import { StyleSheet, TextInput, TextInputProps, useColorScheme } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
    value: string;
    setValue: (value: string) => void;
    placeholder?: string;
    keyboardType?: TextInput['props']['keyboardType'];
    textContentType?: TextInput['props']['textContentType'];
    [x: string]: any;
}

export default function ThemedTextInput({ value, setValue, placeholder, keyboardType, textContentType, style, ...rest }: ThemedTextInputProps) {
    const theme = useColorScheme() ?? 'light';
    const isDark = theme === 'dark';

    return (
        <TextInput 
            keyboardType={keyboardType} 
            value={value} 
            onChangeText={setValue} 
            style={[isDark ? styles.themedInputDark : styles.themedInputLight, style]} 
            placeholder={placeholder} 
            textContentType={textContentType}
            secureTextEntry={textContentType === 'password'}
            placeholderTextColor={isDark ? Colors.dark.inputTextColor : Colors.light.inputTextColor}
            {...rest}
        />
    )
}

const styles = StyleSheet.create({
    themedInputLight: {
        backgroundColor: Colors.light.inputColor,
        color: 'black',
        fontFamily: 'Rubik-Regular',
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    themedInputDark: {
        backgroundColor: Colors.dark.inputColor,
        color: 'white',
        fontFamily: 'Rubik-Regular',
        borderWidth: 1,
        borderColor: Colors.dark.border
    }
})