import { create } from "zustand";

export const useFolderContextMenuStore = create((set) => ({
    x: null, 
    y: null,
    isOpenFolder: false,
    folder: null,
    setFolderX: (incomingFolderX) => {
        set({
            x: incomingFolderX
        });
    },
    setFolderY: (incomingFolderY) => {
        set({
            y: incomingFolderY
        });
    },
    setIsOpenFolder: (incomingIsOpenFolder) => {
        set({
            isOpenFolder: incomingIsOpenFolder
        });
    },
    setFolder: (incomingFolder) => {
        set({
            folder: incomingFolder
        });
    },
}))