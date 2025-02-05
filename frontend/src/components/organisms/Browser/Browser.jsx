import { useEffect, useRef } from "react";
import { Input, Row } from "antd";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { usePortStore } from "../../../store/portStore";
import { ReloadOutlined } from "@ant-design/icons";

export const Browser = ({ projectId }) => {
    const browserRef = useRef(null); // Reference for the iframe
    const { port } = usePortStore(); // Getting port state
    const { editorSocket } = useEditorSocketStore(); // Getting editor socket

    useEffect(() => {
        // Request port from backend if not available
        if (!port) {
            editorSocket?.emit("getPort", {
                containerName: projectId
            });
        }
    }, [port, editorSocket]);

    // Show loading state until port is assigned
    if (!port) {
        return <div>Loading....</div>;
    }

    function handleRefresh() {
        // Refresh iframe by reassigning the src
        if (browserRef.current) {
            const oldAddr = browserRef.current.src;
            browserRef.current.src = oldAddr;
        }
    }

    return (
        <Row
            style={{
                backgroundColor: "#22212b"
            }}
        >
            {/* Address bar with refresh button */}
            <Input 
                style={{
                    width: "100%",
                    height: "30px",
                    color: "white",
                    fontFamily: "Fira Code",
                    backgroundColor: "#282a35",
                }}
                prefix={<ReloadOutlined onClick={handleRefresh} />}
                defaultValue={`http://localhost:${port}`}
            />

            {/* Iframe to load the project */}
            <iframe 
                ref={browserRef}
                src={`http://localhost:${port}`}
                style={{
                    width: "100%",
                    height: "95vh",
                    border: "none"
                }}
            />
        </Row>
    );
};
