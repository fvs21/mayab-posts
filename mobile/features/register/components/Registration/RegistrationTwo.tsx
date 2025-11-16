import GoBackButton from "@/components/GoBackButton";
import PrimaryDisabledButton from "@/components/PrimaryDisabledButton";
import { ThemedText } from "@/components/ThemedText";
import ValidatedInput from "@/components/ValidatedInput";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useEmail } from "../../store";
import { validateEmail } from "../../utils/validation";
import styles from "./Registration.style";

export default function RegistrationTwo() {
    const [email, setEmail] = useEmail();

    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <GoBackButton />
                <ThemedText weight="300" type="title">
                    What's your email?
                </ThemedText>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer} keyboardVerticalOffset={68}>
                <ValidatedInput 
                    value={email} 
                    setValue={setEmail} 
                    placeholder="Email" 
                    style={styles.input} 
                    valid={email.length === 0 || validateEmail(email)} 
                    error="Invalid email address" 
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <PrimaryDisabledButton
                    text="Next"
                    click={() => navigation.push("Register", {step: 2})}
                    disabled={email.length === 0 || !validateEmail(email)}
                />
            </KeyboardAvoidingView>
        </View>
    )
}