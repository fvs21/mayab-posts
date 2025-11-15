import GoBackButton from "@/components/GoBackButton";
import PasswordInput from "@/components/PasswordInput";
import PrimaryDisabledButton from "@/components/PrimaryDisabledButton";
import { ThemedText } from "@/components/ThemedText";
import { flash } from "@/features/flash/core/flash-message-creator";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRegister } from "../../api";
import { useEmail, useFullName, usePassword, useUsername } from "../../store";
import { RegisterBody } from "../../types";
import styles from "./Registration.style";

export default function RegistrationFour() {
    const [fullName] = useFullName();
    const [email] = useEmail();
    const [username] = useUsername();
    const [password, setPassword] = usePassword();

    const navigation = useNavigation<any>();
    const { register, isPending, registerDisabled } = useRegister();

    const body: RegisterBody = {
        full_name: fullName,
        email: email,
        username: username,
        password: password
    }

    async function handleRegister() {
        try {
            await register(body);
        } catch {
            flash("An error occurred. Please try again later.", 5000, "error");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <GoBackButton />
                <ThemedText weight="300" type="title">
                    Choose a password
                </ThemedText>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer} keyboardVerticalOffset={68}>
                <PasswordInput 
                    value={password} 
                    setValue={setPassword} 
                    placeholder="Password" 
                    style={styles.input} 
                />
                <PrimaryDisabledButton
                    text="Next"
                    click={handleRegister}
                    disabled={password.length <= 8}
                />
            </KeyboardAvoidingView>
        </View>
    )
}