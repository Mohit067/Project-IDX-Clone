import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/treeStructure/treeStructure";
import { useEffect } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from 'socket.io-client'
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";


export const ProjectPlayground = () => {
    const {projectId: projectIdFromUrl  } = useParams();

    const {setProjectId, projectId} = useTreeStructureStore();

    const { setEditorSocket, editorSocket } = useEditorSocketStore();

    const { setTerminalSocket } = useTerminalSocketStore();

    function fetchPort() {
        editorSocket.emit("getPort");
    }

    useEffect(() => {
        if(projectIdFromUrl){
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            const ws = new WebSocket("ws://localhost:3000/terminal?projectId="+projectIdFromUrl);
            setTerminalSocket(ws);
            setEditorSocket(editorSocketConnection);
        }
    }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

    return (
        <>
            <div style={{display: "flex"}}>
                {projectId && 
                    <div
                        style={{
                            background: "#333254",
                            paddingRight: "10px",
                            paddingTop: "0.3vh",
                            minWidth: "250px",
                            maxWidth: "25%",
                            height: "99.7vh",
                            overflow: "auto"
                        }}  
                    >
                        < TreeStructure />  
                    </div>
                }
                < EditorComponent />
            </div>
            < EditorButton isActive={false}/>
            < EditorButton isActive={true}/>
            <div>
                <button
                    onClick={fetchPort}
                >
                    getport
                </button>
            </div>
            <div>
                <BrowserTerminal />
            </div>
            
        </>
    )
}


// import { useParams } from "react-router-dom";
// import { useEffect } from "react";
// import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
// import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
// import { TreeStructure } from "../components/organisms/treeStructure/treeStructure";
// import { useTreeStructureStore } from "../store/treeStructureStore";
// import { useEditorSocketStore } from "../store/editorSocketStore";
// import { io } from 'socket.io-client'
// import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
// import { useTerminalSocketStore } from "../store/terminalSocketStore";

// export const ProjectPlayground = () => {
//     const { projectId: projectIdFromUrl } = useParams();
//     const { setProjectId, projectId } = useTreeStructureStore();
//     const { setEditorSocket, editorSocket } = useEditorSocketStore();
//     const { setTerminalSocket } = useTerminalSocketStore();

//     function fetchPort() {
//         editorSocket.emit("getPort");
//     }

//     useEffect(() => {
//         if (projectIdFromUrl) {
//             setProjectId(projectIdFromUrl);
            
//             // Dynamically setting WebSocket URL
//             const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
//             const ws = new WebSocket(`${backendUrl.replace("http", "ws")}/terminal?projectId=${projectIdFromUrl}`);

//             // WebSocket event listeners
//             ws.onopen = () => console.log("WebSocket connected successfully");
//             ws.onerror = (error) => console.error("WebSocket error:", error);
//             ws.onclose = () => {
//                 console.warn("WebSocket closed, attempting to reconnect...");
//                 setTerminalSocket(new WebSocket(`${backendUrl.replace("http", "ws")}/terminal?projectId=${projectIdFromUrl}`));
//             };

//             // Set terminal socket
//             setTerminalSocket(ws);

//             // Cleanup on unmount
//             return () => {
//                 console.log("Closing WebSocket on component unmount");
//                 ws.close();
//             };
//         }
//     }, [projectIdFromUrl, setProjectId, setEditorSocket, setTerminalSocket]);

//     return (
//         <>
//             <div style={{ display: "flex" }}>
//                 {projectId && (
//                     <div style={{
//                         background: "#333254",
//                         paddingRight: "10px",
//                         paddingTop: "0.3vh",
//                         minWidth: "250px",
//                         maxWidth: "25%",
//                         height: "99.7vh",
//                         overflow: "auto"
//                     }}>
//                         <TreeStructure />
//                     </div>
//                 )}
//                 <EditorComponent />
//             </div>
//             <EditorButton isActive={false} />
//             <EditorButton isActive={true} />
            // <div>
            //     <button
            //         onClick={fetchPort}
            //     >
            //         getport
            //     </button>
            // </div>
//             <div>
//                 <BrowserTerminal />
//             </div>
//         </>
//     );
// };
