import fs from "fs/promises"; 

export const handleEditorSocketEvent = (socket, editorNamespace) => {
    socket.on("writeFile", async( { data, pathTofileOrFolder }) => {
        try {
            const response = await fs.writeFile(pathTofileOrFolder, data);
            editorNamespace.emit("wirteFileSuccess", {
                data: "data wirtten success",
                path: pathTofileOrFolder,
            })
        } catch (error) {
            console.log("error wirting the file", error);
            socket.emit("error", {
                data: "error writting the file",
            });
        }
    });

    socket.on("createFile", async( { pathTofileOrFolder }) => {
        const isFileAlreadyPresent = await fs.stat(pathTofileOrFolder);
        if(isFileAlreadyPresent){
            socket.emit("error", {
                data: "File already exist",
            });
            return;

        }    
        try {
            const response = await fs.writeFile(pathTofileOrFolder, "");
            socket.emit("createFileSuccess", {
                data: "File create success"
            });
        } catch (error) {
            console.log("error creating the file", error);
            socket.emit("error", {
                data: "error creating the file",
            });
        }
    });

    socket.on("readFile", async( { pathTofileOrFolder }) => {
        try {
            const response = await fs.readFile(pathTofileOrFolder); 
            console.log(response.toString());
            socket.emit("readFileSuccess", {
                value: response.toString(),
                path: pathTofileOrFolder,
            });
        } catch (error) {
            console.log("error reading the file", error);
            socket.emit("error", {
                data: "error reading the file",
            });
        }
    }); 

    socket.on("deleteFile", async( { pathTofileOrFolder }) => {
        try {
            const response = await fs.unlink(pathTofileOrFolder);
            socket.emit("deleteFileSuccess", {
                data: "File delete success",
            });
        } catch (error) {
            console.log("error deleting the file", error);
            socket.emit("error", {
                data: "error deleting the file",
            });
        }
    });

    socket.on("createFolder", async ({ pathTofileOrFolder }) => {
        try {
            const response = await fs.mkdir(pathTofileOrFolder);
            socket.emit("createFolderSuccess", {
                data: "Folder create success",
            });
        } catch (error) {
            console.log("Error creating the folder", error);
            socket.emit("error", {
                data: "Error creating the folder",
            })
        }
    });

    socket.on("deleteFolder", async( { pathTofileOrFolder }) => {
        try {
            const response = await fs.rmdir(pathTofileOrFolder, { recursive: true });
            socket.emit("deleteFolderFileSuccess", {
                data: "File deleteFolder success",
            });
        } catch (error) {
            console.log("error deleting the Folder", error);
            socket.emit("error", {
                data: "error deleting the Folder",
            });
        }
    });

    // const fs = require("fs").promises;

    socket.on("renameFileOrFolder", async ({ pathTofileOrFolder, newPath }) => {
        try {
            // Check if the file/folder exists
            await fs.stat(pathTofileOrFolder);

            // Rename (move) the file or folder
            await fs.rename(pathTofileOrFolder, newPath);

            socket.emit("renameFileOrFolderSuccess", {
                data: "File/Folder renamed success",
            });
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("File/Folder does not exist:", pathTofileOrFolder);
                socket.emit("error", {
                    data: "File/Folder does not exist",
                });
            } else {
                console.log("Error renaming the file/folder:", error);
                socket.emit("error", {
                    data: "Error renaming the file/folder",
                });
            }
        }
    });

}