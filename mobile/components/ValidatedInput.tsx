import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthenticationInput from "./AuthenticationInput";
import { ThemedText } from "./ThemedText";
import { ThemedTextInputProps } from "./ThemedTextInput";

type ValidatedInputProps = {
    valid: boolean;
    error: string;
}

export default function ValidatedInput({
    value, 
    setValue, 
    valid, 
    error, 
    placeholder, 
    keyboardType, 
    textContentType, 
    style, 
    ...rest
}: ThemedTextInputProps & ValidatedInputProps) {
    const [focused, setFocused] = useState(false);
    
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);

    const showError = !valid && !focused && error;

    return (
        <View>
            <AuthenticationInput 
                value={value}
                setValue={setValue}
                placeholder={placeholder}
                keyboardType={keyboardType}
                textContentType={textContentType}
                style={[showError && styles.errorInput, style]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...rest}
            />
            {showError && (
                <ThemedText 
                    style={styles.errorText} 
                    weight='300' 
                    type='default'
                >
                    {error}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    errorInput: {
        borderColor: '#FF0000',
        borderWidth: 1,
    },
    errorText: {
        color: '#FF0000',
        marginTop: 4,
    }
});