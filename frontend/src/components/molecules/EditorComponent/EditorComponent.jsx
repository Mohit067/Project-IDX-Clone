import { Editor } from "@monaco-editor/react"
import { useDebugValue, useEffect, useState } from "react"
import { useActiveFileTabStore } from "../../../store/activeFileTabStore"
import { useEditorSocketStore } from "../../../store/editorSocketStore"
import { extensionToFilType } from "../../../utils/extentionToFileType"

export const EditorComponent = () => {

    let timerId = null;

    const [editorState, setEditorState] = useState({
        theme:null
    })

    const { activeFileTab } = useActiveFileTabStore();
    const { editorSocket } =  useEditorSocketStore();
    async function downloadTheme() {
        const response = await fetch('/Dracula.json');
        const data = await response.json();
        setEditorState({ ...editorState, theme: data});
    }

    function handleEditorTheme (editor, monaco){
        monaco.editor.defineTheme('dracula', editorState.theme);
        monaco.editor.setTheme('dracula');
    }
    
    function handleChange(value) {
        // DeBouncing --> mohit
        // clear old timer
        if(timerId != null){
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            const editorContent = value;
            console.log("sending writefile event");
            editorSocket.emit("writeFile", {
                data: editorContent,
                pathTofileOrFolder: activeFileTab.path,
            })
        }, 2000);

    }

    useEffect(() => {
        downloadTheme();
    }, [])


    return (
        <>
            {   editorState.theme &&
                <Editor
                height={'100vh'}
                width={'100%'}
                defaultLanguage={undefined}
                defaultValue="//welcome to the playground"
                options={{
                    fontSize: 18,
                    fontFamily: 'monospace'
                }}
                language={extensionToFilType(activeFileTab?.extension)}
                onChange={handleChange}
                value={activeFileTab?.value ? activeFileTab.value : '// Welcome to playground'}
                onMount={handleEditorTheme}
                />
            }
        </>
    )
}