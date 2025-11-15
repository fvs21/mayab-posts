import { Dispatch, SetStateAction } from "react";

export type FlashMessage = {
    id: string;
    data: string;
    type: 'success' | 'error' | 'info';
    deleteFlash: Function;
}

export type FlashMessageCreator = {
    flash: (message: string, timeout: number, type: "success" | "error" | 'info') => void;
    setUpdateFlashes: (func: Dispatch<SetStateAction<FlashMessage[]>>) => void;
    deleteAll: Function;
}