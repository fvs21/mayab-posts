import { useNavigation } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import XLg from "./svgs/XLg";

export default function GoBackButton() {
    const navigation = useNavigation();

    const theme = useColorScheme();

    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <XLg width={22} color={theme === 'dark' ? 'white' : 'black'}/>
        </TouchableOpacity>
    )
}