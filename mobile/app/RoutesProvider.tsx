import { useFetchUser } from '@/api/auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import Register from './root/auth/register';
import Feed from './root/feed';
import Login from './root/login';
import Post from './root/post';
import CreatePost from './root/create-post';
import { useToken } from '@/api/auth/store';

const Stack = createNativeStackNavigator();

export default function RoutesProvider() {
    const { user, isLoading } = useFetchUser();
    const [token] = useToken();

    if (isLoading)
        return <View />

    if (!user || !token) {
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
            <Stack.Screen name="Post" component={Post} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="CreatePost" component={CreatePost} />
            </Stack.Group>
        </Stack.Navigator>
    )

}