import { DefaultResponse, User } from "@/types/globals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SecureStore from 'expo-secure-store';
import { api, apiGuest } from "..";

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
        mutationFn: async (body: { username: string, password: string }) => {
            const request = await apiGuest.post('/auth/login', body);
            return request.data;
        },
        onSuccess: async (data: DefaultResponse<"data", { access_token: string, refresh_token: string, user: User }>) => {
            await SecureStore.setItemAsync('token', data.data.access_token);
            queryClient.setQueryData(['user'], data.data.user);
            queryClient.setQueryData(['access_token'], data.data.access_token);
        }
    });

    return {
        login,
        isPending,
        loginDisabled: isPending && !isError
    }
}