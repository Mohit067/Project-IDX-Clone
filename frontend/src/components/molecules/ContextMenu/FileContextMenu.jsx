import './FileContextMenu.css'

import { useFileContextMenuStore } from "../../../store/fileContextMenuStore";
import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useEffect, useRef, useState } from 'react';

export const FileContextMenu = ({ x, y, path}) => {

    const { setIsOpen } = useFileContextMenuStore();

    const { editorSocket } = useEditorSocketStore();

    const [isRenaming, setIsRenaming] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const inputRef = useRef(null);

    const pathParts = path.split("\\"); 
    const currentFileName = pathParts[pathParts.length - 1]; 

    useEffect(() => {
        if (isRenaming && inputRef.current) {
          inputRef.current.focus(); 
        }
      }, [isRenaming]);

    //delete file 

    function handleFileDelete(e){
        e.preventDefault();
        console.log("deleting file at ", path);
        editorSocket.emit("deleteFile", {
            pathTofileOrFolder: path
        })
    }

    // rename file
    function handleRename(e) {
        e.preventDefault();
        setIsRenaming(true);
        setNewFileName(currentFileName);
    }

    function handleRenameSubmit(e) {
        e.preventDefault();

        if(!newFileName.trim() || newFileName.trim() === currentFileName) {
            console.log("Rename cancelled or no changes made.");
            setIsRenaming(false);
            return;
        }

        pathParts[pathParts.length - 1] = newFileName.trim();
        const newPath = pathParts.join("\\");

        console.log("Renaming file from:", path, "to:", newPath);

        editorSocket.emit("rename", {
            oldPath: path,
            newPath: newPath,
        });
        setIsRenaming(false);
        setIsOpen(false);

    }

    function handleCancelRename() {
        setIsRenaming(false);
      }

      return (
        <div
            className='fileContextOptionWrapper'
            style={{
                backgroundColor: isRenaming ? "#f9fafb" : "transparent",
                border: isRenaming ? "1px solid #e2e8f0" : "none",
                left: x,
                top: y,
            }}
        >
            <div
                onMouseLeave={() => {
                    console.log("Mouse Left");
                    setIsOpen(false);
                }}
                className='fileContextOptionWrapper'
                style={{
                    backgroundColor: isRenaming ? "#f9fafb" : "transparent",
                    border: isRenaming ? "1px solid #e2e8f0" : "none",
                    left: x,
                    top: y,
                }}
            >   
                {/* Handle renaming input field */}
                {isRenaming ? (
                    <form onSubmit={handleRenameSubmit} style={{ width: "80%" }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            onBlur={handleCancelRename} // Cancel rename on blur
                            onKeyDown={(e) => {
                                if (e.key === "Escape") handleCancelRename(); // Escape key cancels rename
                            }}
                            style={{
                                width: "80%",
                                border: "none",
                                outline: "none",
                                fontSize: "14px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                background: "white",
                                boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                    </form>
                ) : (
                    <span
                        style={{
                            fontSize: "14px",
                            color: "#2d3748",
                            cursor: "pointer",
                            width: "100%",
                            wordBreak: "break-all",
                        }}
                        onDoubleClick={handleRename} // Double-click to rename
                    >
                        {currentFileName}
                    </span>
                )}
            </div>
                
            {/* Show options only when not renaming */}
            {!isRenaming && (
                <div
                    onMouseLeave={() => {
                        console.log("Mouse Left");
                        setIsOpen(false);
                    }}
                    className='fileContextOptionWrapper'
                    style={{
                        backgroundColor: "transparent",
                        border: "1px solid #e2e8f0",
                        left: x,
                        top: y,
                    }}
                >
                    {/* Delete File Button */}
                    <button className='fileContextButton' onClick={handleFileDelete}>
                        🗑️ Delete File
                    </button>
                    
                    {/* Rename File Button */}
                    <button className='fileContextButton' onClick={handleRename}>
                        ✏️ Rename File 
                    </button>
                </div>
            )}
        </div>
    );
}