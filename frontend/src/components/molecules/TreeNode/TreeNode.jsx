import { useState } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FileIcon } from "../../atoms/FileIcon/FileIcon";

export const TreeNode = ({

    fileFolderData

}) => {

    const [visibility, setVisibility] = useState({});

    function toggleVisibility(name){
        setVisibility({
            ...visibility,
            [name]: !visibility[name]
        })
    }

    function computeExtention(fileFolderData){
        const names = fileFolderData.name.split('.');
        return names[names.length - 1];
    }

    return (
        ( fileFolderData &&
        <div
            style={{
                paddingLeft: "15px",
                color: "while"
            }}
        >
            {fileFolderData.children /** if the current node is a folder ? */? (
                /** if the current node is a folder, render this button */
                <button
                    
                    onClick={() => { toggleVisibility(fileFolderData.name) }}
                    style={{
                        border: "none",
                        cursor: "pointer",
                        outline: "none",
                        color: "white",
                        background: "transparent",
                        paddingTop: "15px",
                        fontSize: "16px",

                    }}
                >
                    {visibility[fileFolderData.name] ? <IoIosArrowDown /> : <IoIosArrowForward />}
                    {fileFolderData.name}
                </button>
            ) : (
                /** If the current node is not folder, show it as a p tag */
                <div style={{ display:"flex", alignItems:"center" }}>
                    <FileIcon extension={computeExtention(fileFolderData)}/>
                    <p
                        style={{
                            paddingTop: "5px",
                            fontSize: "15px",
                            cursor: "pointer",
                            margin: "5px"
                        }}
                    >
                        {fileFolderData.name}
                    </p>
                </div>
            )}
            {visibility[fileFolderData.name] && fileFolderData.children && (
                fileFolderData.children.map((child) => (
                    <TreeNode 
                        fileFolderData={child}
                        key={child.name}
                    />
                ))
            )}
        </div> )
    )
}