import { atom, useAtom } from "jotai";

export const fullNameAtom = atom<string>("");
export const emailAtom = atom<string>("");
export const usernameAtom = atom<string>("");
export const passwordAtom = atom<string>("");

export const useFullName = () => {
    return useAtom(fullNameAtom);
}

export const useEmail = () => {
    return useAtom(emailAtom);
}

export const useUsername = () => {
    return useAtom(usernameAtom);
}

export const usePassword = () => {
    return useAtom(passwordAtom);
}