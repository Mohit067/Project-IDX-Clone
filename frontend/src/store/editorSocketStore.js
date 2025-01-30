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
            // incomingSocket.emit("readFile", {
            //     pathTofileOrFolder: data.path
            // });
        });

        incomingSocket?.on("deleteFileSuccess", () => {
            projectTreeStructureSetter();
        })

        set({
            editorSocket: incomingSocket,
        })
    }
}));
