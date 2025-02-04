import fs from "fs/promises"; 

export const handleEditorSocketEvent = (socket, editorNamespace) => {

    // write file
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



    // read file
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

    // delete file
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

    // create file
    socket.on("createFile", async( { pathTofileOrFolder }) => {
        // Check if the file already exists
        try {
            // Check if the file already exists
            try {
                await fs.access(pathTofileOrFolder); // Throws an error if file doesn't exist
                socket.emit("error", { data: "File already exists" });
                return;
            } catch (accessError) {
                if (accessError.code !== "ENOENT") {
                    throw accessError; // Re-throw unexpected errors
                }
            }

            // Create the file since it doesn't exist
            await fs.writeFile(pathTofileOrFolder, "");
            console.log("File created successfully");

            socket.emit("createFileSuccess", {
                data: "File created successfully",
                path: pathTofileOrFolder, // Send path back to the client
            });
        } catch (error) {
        console.error("Error creating the file:", error);
        socket.emit("error", { data: "Error creating the file" });
    }
});

    // create folder
    socket.on("createFolder", async ({ pathTofileOrFolder }) => {
        try {
            const response = await fs.mkdir(pathTofileOrFolder);
            socket.emit("createFolderSuccess", {
                data: "Folder create success",
                path: pathTofileOrFolder, // Send path back to the client
            });
        } catch (error) {
            console.log("Error creating the folder", error);
            socket.emit("error", {
                data: "Error creating the folder",
            })
        }
    });

    // rename file or folder
    socket.on("rename", async ({ oldPath, newPath }) => {
        try {
            // Check if the file/folder exists
            await fs.access(oldPath);
            console.log("Renaming:", oldPath, "to", newPath);

            // Rename (move) the file or folder
            await fs.rename(oldPath, newPath);

            socket.emit("renameSuccess", {
                message: `Successfully rename file/folder from ${oldPath} to ${newPath}`,
            });
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log("File/Folder does not exist:", oldPath);
                socket.emit("error", {
                    data: "File/Folder does not exist",
                });
            } else if (error.code === "EPERM") {
                console.log("Permission denied. Close any open files:", oldPath);
                socket.emit("error", {
                    data: "Permission denied. Close any open files.",
                }) 
            } else {
                console.log("Error renaming the file/folder:", error);
                socket.emit("error", {
                    data: "Error renaming the file/folder",
                });
            }
        }
    });

    // delete folder
    socket.on("deleteFolder", async( { pathTofileOrFolder }) => {
        try {
            await fs.rm(pathTofileOrFolder, { recursive: true });
            socket.emit("deleteFolderSuccess", {
                data: "File deleteFolder success",
            });
        } catch (error) {
            console.log("error deleting the Folder", error);
            socket.emit("error", {
                data: "error deleting the Folder",
            });
        }
    });

}