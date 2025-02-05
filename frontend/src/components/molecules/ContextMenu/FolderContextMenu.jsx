import './FolderContextMenu.css'

import { useEditorSocketStore } from '../../../store/editorSocketStore';
import { useFolderContextMenuStore } from '../../../store/folderContextMenuStore';
import { useEffect, useRef, useState } from 'react';

export const FolderContextMenu = ({ x, y, path }) => {

    const { setIsOpenFolder } = useFolderContextMenuStore();

    const { editorSocket } = useEditorSocketStore();

    const [isRenaming, setIsRenaming] = useState(false);
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newName, setNewName] = useState("");
    const inputRef = useRef(null);

    const pathParts = path.split("\\");
    const currentFolderName = pathParts[pathParts.length - 1];

    useEffect(() => {
        if ((isRenaming || isCreatingFile || isCreatingFolder) && inputRef.current) {
          inputRef.current.focus();
        }
      }, [isRenaming, isCreatingFile, isCreatingFolder]);

    // delete folder
    function handleFolderDelete(e){
        e.preventDefault();
        console.log("deleting file at ", path);
        editorSocket.emit("deleteFolder", {
            pathTofileOrFolder: path
        })
    }

    // rename folder
    function handleRename(e) {
        e.preventDefault();
        setIsRenaming(true);
        setNewName(currentFolderName);
    }

    function handleRenameSubmit(e) {
        e.preventDefault();
        if (!newName.trim() || newName.trim() === currentFolderName) {
            console.log("Rename cancelled or no changes made.");
            setIsRenaming(false);
            return;
        }
        pathParts[pathParts.length - 1] = newName.trim();
        const newPath = pathParts.join("\\");
        console.log("Renaming folder from:", path, "to:", newPath);

        editorSocket.emit("rename", { oldPath: path, newPath: newPath });
        setIsRenaming(false);
        setIsOpenFolder(false);
    }

    function handleCancel() {
        setIsRenaming(false);
        setIsCreatingFile(false);
        setIsCreatingFolder(false);
    }

    // create file
    function handleFileCreate(e){
        e.preventDefault();
        setIsCreatingFile(true);
        setNewName("");
    }

    // create folder
    function handleFolderCreate(e){
        e.preventDefault();
        setIsCreatingFolder(true);
        setNewName("");
    }

    function handleCreateSubmit(e) {
        e.preventDefault();
        if (!newName.trim()) {
          console.log("Creation cancelled: empty name.");
          handleCancel();
          return;
        }
    
        const newPath = `${path}\\${newName.trim()}`;

        if (isCreatingFile) {
          console.log("Creating file at:", newPath);
          editorSocket.emit("createFile", { pathTofileOrFolder: newPath });
        } else if (isCreatingFolder) {
          console.log("Creating folder at:", newPath);
          editorSocket.emit("createFolder", { pathTofileOrFolder: newPath });
        }
        handleCancel();
        setIsOpenFolder(false);
      }

    return (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: isRenaming ? "#f9fafb" : "transparent",
              border: isRenaming ? "1px solid #e2e8f0" : "none",
              borderRadius: "4px",
              position: "relative",
            }}
          >
            {(isRenaming || isCreatingFile || isCreatingFolder) ? (
              <form onSubmit={isRenaming ? handleRenameSubmit : handleCreateSubmit} style={{ width: "100%" }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleCancel}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") handleCancel();
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    background: "white",
                    boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
                onDoubleClick={handleRename}
              >
                {currentFolderName}
              </span>
            )}
          </div>
    
          {!isRenaming && !isCreatingFile && !isCreatingFolder && (
            <div
              onMouseLeave={() => setIsOpenFolder(false)}
              style={{
                width: "160px",
                position: "fixed",
                left: x,
                top: y,
                border: "1px solid #e2e8f0",
                background: "white",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                borderRadius: "8px",
                padding: "8px 0",
                fontFamily: "'Inter', sans-serif",
                animation: "fadeIn 0.2s ease-in-out",
              }}
            >
              <button
                style={menuButtonStyle}
                onClick={handleFolderDelete}
              >
                🗑️ Delete Folder
              </button>
              <button
                style={menuButtonStyle}
                onClick={handleRename}
              >
                ✏️ Rename Folder
              </button>
              <button
                style={menuButtonStyle}
                onClick={handleFileCreate}
              >
                📄 Create File
              </button>
              <button
                style={menuButtonStyle}
                onClick={handleFolderCreate}
              >
                📂 Create Folder
              </button>
            </div>
          )}
        </>
      );
    };
    
    const menuButtonStyle = {
      display: "block",
      width: "100%",
      padding: "12px 20px", // Slightly more padding for better spacing
      textAlign: "left",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: "14px",
      color: "#2d3748",
      borderRadius: "6px", // Rounded corners for a softer look
      transition: "background 0.2s ease, color 0.2s ease, transform 0.1s ease", // Added transform for hover effect
      outline: "none", // Remove default focus outline
    };
    
   