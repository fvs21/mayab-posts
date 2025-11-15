import { User } from "@/types/globals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import { api, apiGuest } from "..";

export const useRefreshToken = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: refreshToken, isPending, isError } = useMutation({
        mutationFn: async (refresh_token: string) => {
            const request = await apiGuest.get('/auth/mobile/refresh', {
                headers: {
                    Authorization: `Bearer ${refresh_token}`
                }
            });

            return request.data;
        },
        onSuccess: (data: { access_token: string }) => {
            queryClient.setQueryData(['access_token'], data.access_token);
        }
    });

    return {
        refreshToken,
        isPending,
        isError
    }
}

export const useAuth = (): [string, (access_token: string | null) => void] => {
    const queryClient = useQueryClient();

    function setAccessToken(access_token: string | null) {
        queryClient.setQueryData(['access_token'], access_token);
    }

    return [
        queryClient.getQueryData(['access_token']) as string,
        setAccessToken
    ]
}

export const useFetchUser = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: async (): Promise<User> => {
            const request = await api.get('/auth/session');
            
            return request.data;
        }, 
        retry: false
    });

    return {
        user: data,
        isLoading,
        isError
    }
}

export const useLogin = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: login, isPending, isError } = useMutation({
        mutationFn: async (body: { credential: string, password: string }) => {
            const request = await apiGuest.post('/auth/login', body);
            return request.data;
        },
        onSuccess: async (data: { access_token: string, refresh_token: string, user: User }) => {
            await SecureStore.setItemAsync('user_r', data.refresh_token);
            queryClient.setQueryData(['access_token'], data.access_token);
            queryClient.setQueryData(['user'], data.user);
        }
    });

    return {
        login,
        isPending,
        loginDisabled: isPending && !isError
    }
}