import GoBackButton from "@/components/GoBackButtonX";
import PrimaryDisabledButton from "@/components/PrimaryDisabledButton";
import { ThemedText } from "@/components/ThemedText";
import ValidatedInput from "@/components/ValidatedInput";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useFullName } from "../../store";
import styles from "./Registration.style";

export default function RegistrationOne() {
    const [name, setName] = useFullName();
    const headerHeight = useHeaderHeight();

    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <GoBackButton />
                <ThemedText weight="300" type="title">
                    What's your name?
                </ThemedText>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer} keyboardVerticalOffset={headerHeight + 68}>
                <ValidatedInput 
                    style={styles.input} 
                    placeholder="Full name" 
                    value={name}
                    setValue={setName} 
                    valid={name.length >= 5 || name.length === 0}
                    error="Name must be at least 3 characters long"
                />
                <PrimaryDisabledButton
                    text="Next"
                    click={() => {
                        navigation.push("Register", {step: 1});
                    }}
                    disabled={name.length < 5}
                />
            </KeyboardAvoidingView>
        </View>
    )
}