import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { determineRegistrationStep } from '@/features/register/utils';
import { useLocalSearchParams } from 'expo-router';

export default function Register() {
    const { step } = useLocalSearchParams();    

    return (
        <ThemedSafeAreaView>
            {determineRegistrationStep(Number(step))}
        </ThemedSafeAreaView>
    )
}   