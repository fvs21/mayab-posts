import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { deleteAll, setUpdateFlashes } from "../core/flash-message-creator";
import { FlashMessage } from "../types";
import FlashAlert from "./FlashAlert";

export default function FlashRenderer() {
    const [messages, setMessages] = useState<Array<FlashMessage>>([]);

    useEffect(() => {
        setUpdateFlashes(setMessages);
        return () => deleteAll();
    }, [setMessages]);

    return (
        messages.length > 0 &&
            messages.map(function(msg: FlashMessage, i) {
                return (
                    <FlashAlert key={msg.id} type={msg.type} deleteMsg={msg.deleteFlash}>
                       <ThemedText weight="300" type="default">{msg.data}</ThemedText>
                    </FlashAlert>
                )
            }) 
    );
}