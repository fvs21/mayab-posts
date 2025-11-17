import { useFetchUser } from '@/api/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Register from './root/auth/register';
import Feed from './root/feed';
import Login from './root/login';

const Stack = createNativeStackNavigator();

export default function RoutesProvider() {
    const { user, isLoading } = useFetchUser();

    if (isLoading)
        return <View />

    if (!user) {
        return (
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
            </Stack.Navigator>
        )
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Feed" component={Feed} />
        </Stack.Navigator>
    )

}