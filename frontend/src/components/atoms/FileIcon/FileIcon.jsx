import { AiFillFileText } from "react-icons/ai"
import { BiSolidFileJson } from "react-icons/bi"
import { FaCss3, FaFileAlt, FaFileMedicalAlt, FaJs } from "react-icons/fa"
import { FaFileCode, FaHtml5 } from "react-icons/fa6"
import { GrReactjs } from "react-icons/gr"
import { PiFileSvgFill } from "react-icons/pi"
import { SiDotenv,  } from "react-icons/si"

export const FileIcon = ({ extension }) => {

    const iconStyle = {
        height: "1.1rem",
        width:"1.1rem"
    }


    const IconMapper = {
        "js": <FaJs color="yellow" style={iconStyle}/>,
        "jsx": <GrReactjs color="#61dbfa" style={iconStyle}/>,
        "css": <FaCss3 color="#3c99dc" style={iconStyle} />,
        "html": <FaHtml5 color="orange" style={iconStyle} />,
        "json": <BiSolidFileJson color="#cb3837" style={iconStyle} />,
        "txt": <AiFillFileText color="gray" style={iconStyle} />,
        "svg": <PiFileSvgFill color="#E8A200" style={iconStyle}/>,
        "md": <FaFileAlt color="gray" style={iconStyle} />,
        "env": <SiDotenv color="green" style={iconStyle} />,
        "default": <FaFileCode color="gray" style={iconStyle} />
    }

    return (
        <>
            {IconMapper[extension]}
        </>
    )
}
