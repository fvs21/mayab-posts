import { atom, useAtom } from "jotai";

const tokenAtom = atom<string | null>(null);

const useToken = () => {
    return useAtom(tokenAtom);
}

export {
    useToken
}