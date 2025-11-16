import { useNavigation } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import ArrowLeft from "./svgs/ArrowLeft";

export default function GoBackButton() {
    const navigation = useNavigation();

    const theme = useColorScheme();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft width={26} color={theme === 'dark' ? 'white' : 'black'}/>
        </TouchableOpacity>
    )
}