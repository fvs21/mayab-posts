import GoBackButton from "@/components/GoBackButton";
import PrimaryDisabledButton from "@/components/PrimaryDisabledButton";
import CheckLg from "@/components/svgs/CheckLg";
import XLg from "@/components/svgs/XLg";
import { ThemedText } from "@/components/ThemedText";
import ValidatedInput from "@/components/ValidatedInput";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, View } from "react-native";
import { useCheckUsernameAvailability } from "../../api";
import { useUsername } from "../../store";
import styles from "./Registration.style";

export default function RegistrationThree() {
    const [username, setUsername] = useUsername();
    const [usernameAvailable, setUsernameAvailable] = useState<boolean>(true);

    const navigation = useNavigation<any>();

    const { checkUsernameAvailability, isPending, isError } = useCheckUsernameAvailability();
    const [displayCheckMark, setDisplayCheckMark] = useState<boolean>(false);

    const changeUsername = (username: string) => {
        setUsername(username);
        setDisplayCheckMark(false);
    }
    

    useEffect(() => {
        const timeout = setTimeout(async () => {
            if(username.length === 0) return;

            try {
                const req = await checkUsernameAvailability(username);
                setUsernameAvailable(req);
                setDisplayCheckMark(req)
            } catch(error) {
                setUsernameAvailable(false);
            }
        }, 600);

        return () => clearTimeout(timeout);
    }, [username]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <GoBackButton />
                <ThemedText weight="300" type="title">
                    Choose a username
                </ThemedText>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer} keyboardVerticalOffset={68}>
                <View style={styles.usernameInputContainer}>
                    <ValidatedInput 
                        value={username} 
                        setValue={changeUsername} 
                        placeholder="Username" 
                        style={styles.input} 
                        valid={usernameAvailable} 
                        error="Username already in use" 
                        autoCapitalize="none"
                    />
                    {isPending && 
                        <ActivityIndicator size="small" color="white" style={{position: "absolute", right: 20, top: 20}} />
                    }
                    {!usernameAvailable && 
                        <View style={{position: "absolute", right: 20, top: 20}}>
                            <XLg width={20} color="red" />
                        </View>
                    }
                    {displayCheckMark &&
                        <View style={{position: "absolute", right: 20, top: 20}}>
                            <CheckLg width={20} color="green" />
                        </View>
                    }
                </View>
                <PrimaryDisabledButton
                    text="Next"
                    click={() => navigation.push("Register", {step: 3})}
                    disabled={!usernameAvailable}
                />
            </KeyboardAvoidingView>
        </View>
    )
}