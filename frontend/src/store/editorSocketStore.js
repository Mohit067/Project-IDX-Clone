import { create } from 'zustand';
import { useActiveFileTabStore } from './activeFileTabStore';
import { useTreeStructureStore } from './treeStructureStore';

export const useEditorSocketStore = create((set) => ({
    editorSocket: null,
    setEditorSocket: (incomingSocket) => {

        const activeFileTabSetter = useActiveFileTabStore.getState().setActiveFileTab;
        const projectTreeStructureSetter = useTreeStructureStore.getState().setTreeStructure;

        incomingSocket?.on("readFileSuccess", (data) => {
            console.log("File read successfully:", data);
            const fileExtention = data.path.split('.').pop();
            activeFileTabSetter(data.path, data.value, fileExtention);
        });

        incomingSocket?.on("wirteFileSuccess", (data) => {
            console.log("File write successfully:", data);
        });

        incomingSocket?.on("createFileSuccess", () => {
            console.log("crete file response socket");
            projectTreeStructureSetter();
        });

        incomingSocket?.on("deleteFileSuccess", () => {
            projectTreeStructureSetter();
        });

        incomingSocket?.on("deleteFolderSuccess", () => {
            console.log("rename successfully");
            projectTreeStructureSetter();
        });

        incomingSocket?.on("createFolderSuccess", () => {
            console.log("create a folder successfully");
            projectTreeStructureSetter();
        })

        incomingSocket?.on("renameSuccess", () => {
            projectTreeStructureSetter();
        })
        set({
            editorSocket: incomingSocket,
        })


    }
}));
