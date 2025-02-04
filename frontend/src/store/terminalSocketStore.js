import { create } from "zustand";

export const useTerminalSocketStore = create((set) => {
    return {
        terminalSocket: null,
        setTerminalSocket: (incomingSokcet) => {
            set({
                terminalSocket: incomingSokcet
            });
        }
    }
})