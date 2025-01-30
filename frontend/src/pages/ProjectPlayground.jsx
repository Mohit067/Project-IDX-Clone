import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/treeStructure/treeStructure";
import { useEffect } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from 'socket.io-client'


export const ProjectPlayground = () => {
    const {projectId: projectIdFromUrl  } = useParams();

    const {setProjectId, projectId} = useTreeStructureStore();

    const { setEditorSocket } = useEditorSocketStore();

    useEffect(() => {
        if(projectIdFromUrl){
            setProjectId(projectIdFromUrl);
            const editorSocketConnection = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
                query: {
                    projectId: projectIdFromUrl
                }
            });
            setEditorSocket(editorSocketConnection);
        }
    }, [setProjectId, projectIdFromUrl, setEditorSocket]);

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
            
        </>
    )
}