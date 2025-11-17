import * as SecureStore from 'expo-secure-store';
import { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { api, apiMultiPart } from '..';

export default function AuthenticationProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        let interceptor: number;
        let interceptor2: number;

        const checkAuthToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                setToken(token);

                interceptor = api.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
                        return config;
                    }
                )

                interceptor2 = apiMultiPart.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
                        return config;
                    }
                )

            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setIsLoading(false);
                console.log("Finished running");
            }
        };

        checkAuthToken();

        return () => {
            api.interceptors.request.eject(interceptor);
            apiMultiPart.interceptors.request.eject(interceptor2);
        } 
    }, []);

    useLayoutEffect(() => {
        const interceptor = api.interceptors.request.use(
            (config) => {
                config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
                return config;
            }
        )

        const interceptor2 = apiMultiPart.interceptors.request.use(
            (config) => {
                config.headers.Authorization = !(config as any)._retry && token ? `Bearer ${token}` : config.headers.Authorization;
                return config;
            }
        )

        return () => {
            api.interceptors.request.eject(interceptor);
            apiMultiPart.interceptors.request.eject(interceptor2);
        }
    }, [token]);

    if (isLoading) {
        return <View />
    }

    return children;
}