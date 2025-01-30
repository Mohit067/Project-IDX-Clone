import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";
import { useEditorSocketStore } from "../../../store/editorSocketStore";
import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";

export const TreeNode = ({ fileFolderData }) => {
    const [visibility, setVisibility] = useState({}); // Tracks folder visibility
    const { editorSocket } = useEditorSocketStore();
    const { setFile, setIsOpen, setX, setY } = useFileContextMenuStore();

    // Toggle folder visibility
    const toggleVisibility = (name) => {
        setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
    };

    // Extract file extension
    const computeExtension = (fileName) => fileName.split(".").pop();

    // Handle file double-click
    const handleDoubleClick = (fileFolderData) => {
        if (!fileFolderData?.path || !editorSocket?.connected) {
            console.error("Invalid data or socket not connected");
            return;
        }
        editorSocket.emit("readFile", { pathTofileOrFolder: fileFolderData.path });
    };

    // Handle file right-click (context menu)
    const handleContextMenuForFiles = (e, path) => {
        e.preventDefault();
        setFile(path);
        setX(e.clientX);
        setY(e.clientY);
        setIsOpen(true);
    };

    if (!fileFolderData) return null; // Skip rendering if no data

    return (
        <div style={{ paddingLeft: "15px", color: "white" }}>
            {fileFolderData.children ? (
                // Render folder with toggle button
                <button
                    onClick={() => toggleVisibility(fileFolderData.name)}
                    style={{
                        border: "none",
                        cursor: "pointer",
                        background: "transparent",
                        padding: "5px",
                        fontSize: "20px",
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                    }}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    <span style={{ marginLeft: "5px" }}>{fileFolderData.name}</span>
                </button>
            ) : (
                // Render file with icon and name
                <div style={{ display: "flex", alignItems: "center" }}>
                    <FileIcon extension={computeExtension(fileFolderData.name)} />
                    <p
                        style={{ padding: "5px", fontSize: "20px", cursor: "pointer", margin: "5px" }}
                        onContextMenu={(e) => handleContextMenuForFiles(e, fileFolderData.path)}
                        onDoubleClick={() => handleDoubleClick(fileFolderData)}
                    >
                        {fileFolderData.name}
                    </p>
                </div>
            )}

            {/* Render children if folder is expanded */}
            {visibility[fileFolderData.name] &&
                fileFolderData.children?.map((child) => (
                    <TreeNode fileFolderData={child} key={child.path} />
                ))}
        </div>
    );
};