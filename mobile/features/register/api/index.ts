import { apiGuest } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterBody, RegisterResponse } from "../types";

export const useRegister = () => {
    const queryClient = useQueryClient();

    const { mutateAsync: register, isPending, isError } = useMutation({
        mutationFn: async (body: RegisterBody): Promise<RegisterResponse> => {
            const request = await apiGuest.post("/auth/register", body);
            return request.data;
        },
        onSuccess(data) {
            //queryClient.setQueryData(["user"], data.user);
            queryClient.setQueryData(["access_token"], data.access_token);
        },
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