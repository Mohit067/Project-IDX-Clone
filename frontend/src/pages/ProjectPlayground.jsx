import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { TreeStructure } from "../components/organisms/treeStructure/treeStructure";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from 'socket.io-client'
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocketStore } from "../store/terminalSocketStore";
import { Browser } from "../components/organisms/Browser/Browser";
import { Button, Divider } from "antd";
import { Allotment } from "allotment";
import "allotment/dist/style.css";


export const ProjectPlayground = () => {
    const {projectId: projectIdFromUrl  } = useParams();

    const {setProjectId, projectId} = useTreeStructureStore();

    const { setEditorSocket, editorSocket } = useEditorSocketStore();

    const { terminalSocket, setTerminalSocket } = useTerminalSocketStore();

    const [loadBrowser, setLoadBrowser] = useState(false);


    useEffect(() => {
        if(projectIdFromUrl){
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });

            const ws = new WebSocket("ws://localhost:4000/terminal?projectId="+projectIdFromUrl);
            
            setTerminalSocket(ws);
            setEditorSocket(editorSocketConnection);
        }
    }, [setProjectId, projectIdFromUrl, setEditorSocket, setTerminalSocket]);

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Main Allotment Wrapper */}
            <Allotment>
                {/* Left Pane - TreeStructure */}
                <Allotment.Pane minSize={200} maxSize={400} preferredSize={250}>
                    {projectId && (
                        <div
                            style={{
                                backgroundColor: "#333254",
                                paddingRight: "10px",
                                paddingTop: "0.3vh",
                                height: "100vh",
                                overflow: "auto"
                            }}
                        >
                            <TreeStructure />
                        </div>
                    )}
                </Allotment.Pane>
    
                {/* Right Pane - Editor, Browser, and Terminal */}
                <Allotment.Pane>
                    <Allotment>
                        {/* Left Pane - Editor and Terminal (stacked vertically) */}
                        <Allotment.Pane>
                            <Allotment vertical>
                                {/* Editor */}
                                <Allotment.Pane>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "100%",
                                            height: "100%",
                                            backgroundColor: "#282a36"
                                        }}
                                    >
                                        <EditorComponent />
                                    </div>
                                </Allotment.Pane>
    
                                {/* Terminal */}
                                <Allotment.Pane>
                                    <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "170vh",
                                        height: "100%",
                                        backgroundColor: "#282a36",
                                        overflow: "auto"
                                    }}
                                    >
                                        <Divider 
                                            style={{ 
                                                color: '#ffcc00', 
                                                backgroundColor: '#333254', 
                                                margin: '0', 
                                                padding: '0 100rem 0 0', 
                                                transition: 'all 0.3s ease', 
                                            }} 
                                            plain
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#4a4a72'; // Change background on hover
                                                e.target.style.color ="rgb(220, 21, 21)"; // Change text color on hover
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#333254'; // Revert background
                                                e.target.style.color = '#ffcc00'
                                            }}
                                            >
                                            Terminal
                                        </Divider>

                                        <BrowserTerminal />
                                    </div>
                                </Allotment.Pane>
                            </Allotment>
                        </Allotment.Pane>
    
                        {/* Right Pane - Browser */}
                        <Allotment.Pane>
                            <Button onClick={() => setLoadBrowser(true)}>
                                Load my browser
                            </Button>
                            {loadBrowser && projectIdFromUrl && terminalSocket && (
                                <Browser projectId={projectIdFromUrl} />
                            )}
                        </Allotment.Pane>
                    </Allotment>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
    
    
}
