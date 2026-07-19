import { useEffect } from "react";

interface NuiMessage<T = unknown> {
    type: string;
    detail: T;
}

export function useNuiEvent<T = unknown>(
    eventName: string,
    handler: (data: T) => void
) {
    useEffect(() => {
        const listener = (event: MessageEvent<NuiMessage<T>>) => {

            if (event.data.type === eventName) {
                handler(event.data.detail);
            }
        };

        window.addEventListener("message", listener);
        return () => {
            window.removeEventListener("message", listener);
        };
    }, [eventName, handler]);
}
