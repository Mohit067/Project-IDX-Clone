import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

export const BrowserTerminal = () => {

    const terminalRef = useRef(null);
    const socket = useRef(null);
    const {projectId: projectIdFromUrl} = useParams();

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
                green: "#44cc44",
                yellow: "#ffcc00",
                blue: "#4488ff",
                magenta: "#aa44ff",
                cyan: "#00cccc",
                white: "#f8f8f3",
                brightBlack: "#3c3c3c",
                brightRed: "#ff6666",
                brightGreen: "#66ff66",
                brightYellow: "#ffff66",
                brightBlue: "#66aaff",
                brightMagenta: "#cc66ff",
                brightCyan: "#66ffff",
                brightWhite: "#ffffff",
                orange: "#ff8800",
                pink: "#ff66aa",
                purple: "#9a5aff",
                teal: "#008080",
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
        
        socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
            query: {
                projectId: projectIdFromUrl
            }
        });

        socket.current.on("shell-output", (data) => {
            term.write(data);
        });

        term.onData((data) => {
            console.log(data);
            socket.current.emit("shell-input", data);
        });

        return () => {
            term.dispose();
            socket.current.disconnect();
        }

    }, []);

    return(

        <div
            ref={terminalRef}
            style={{
                height: "25vh",
                overflow: "auto"
            }}
            className="terminal"
            id="terminal-container"
        >

        </div>
    )
}