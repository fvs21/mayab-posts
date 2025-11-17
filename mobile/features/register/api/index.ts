import { apiGuest } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterBody, RegisterResponse } from "../types";
import { DefaultResponse, User } from "@/types/globals";
import * as SecureStore from 'expo-secure-store';

export const useRegister = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: register, isPending, isError } = useMutation({
        mutationFn: async (body: RegisterBody): Promise<DefaultResponse<"data", RegisterResponse>> => {
            const request = await apiGuest.post("/auth/register", body);
            return request.data;
        },
        onSuccess: async (data: DefaultResponse<"data", RegisterResponse>) => {
            await SecureStore.setItemAsync('token', data.data.access_token);
            queryClient.setQueryData(['access_token'], data.data.access_token);
            queryClient.setQueryData(['user'], data.data.user);
        }
    });

    return {
        register,
        isPending,
        registerDisabled: isPending && !isError
    }
}

export const useCheckUsernameAvailability = () => {
    const { mutateAsync: checkUsernameAvailability, isPending, isError } = useMutation({
        mutationFn: async (username: string): Promise<boolean> => {
            const request = await apiGuest.post(`/auth/username_available`, {
                username: username
            });
            return request.data.available;
        },
    });

    return {
        checkUsernameAvailability,
        isPending,
        isError
    }
}