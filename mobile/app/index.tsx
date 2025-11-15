import ThemedSafeAreaView from "@/components/ThemedSafeAreaView";
import { Link } from "expo-router";

export default function Login() {
    return (
        <ThemedSafeAreaView>
            <Link href="/register?step=0" style={{ color: "blue" }}>Go to Register</Link>
        </ThemedSafeAreaView>
    )
}