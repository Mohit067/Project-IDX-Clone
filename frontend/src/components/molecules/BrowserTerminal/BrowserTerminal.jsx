import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { AttachAddon } from "@xterm/addon-attach";
import { useTerminalSocketStore } from "../../../store/terminalSocketStore";

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);

    const{ terminalSocket } = useTerminalSocketStore();

    useEffect(() => {

        const term = new Terminal({
            cursorBlink: true,
            cursorStyle: "block",
            cursorWidth: 2,
            disableStdin: false,
            allowTransparency: true,
            scrollback: 1000,
            tabStopWidth: 4,
            lineHeight: 1.4,
            fontWeight: "bold",
            fontWeightBold: "900",
            letterSpacing: 1.2,
            theme: {
                background: "#282a37",
                foreground: "#f8f8f3",
                cursor: "#f8f8f3",
                cursorAccent: "#282a37",
                selection: "rgba(255, 255, 255, 0.2)",
                black: "#000000",
                red: "#ff5544",
                yellow: "#ffcc00",
                
            },
            
            fontSize: 16,
            fontFamily: "'Fira Code', 'Ubuntu Mono', monospace",
            rightClickSelectsWord: true,
            macOptionIsMeta: true,
            screenKeys: true,
            convertEol: true,
        });
        
    
        term.open(terminalRef.current);
        let fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        fitAddon.fit()
        

        if(terminalSocket) {
            terminalSocket.onopen = () => {
                const attachAddon = new AttachAddon(terminalSocket);
                term.loadAddon(attachAddon);
            }
        }
 
        return () => {
            term.dispose();
            terminalSocket?.close();
        }

    }, [terminalSocket]);

    return(

        <div
            ref={terminalRef}
            className="terminal"
            id="terminal-container"
        >

        </div>
    )
}
