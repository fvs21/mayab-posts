import ThemedSafeAreaView from '@/components/ThemedSafeAreaView';
import { determineRegistrationStep } from '@/features/register/utils';

export default function Register({ navigation, route }: any) {
    const step = route.params.step;

    return (
        <ThemedSafeAreaView>
            {determineRegistrationStep(Number(step))}
        </ThemedSafeAreaView>
    )
}   