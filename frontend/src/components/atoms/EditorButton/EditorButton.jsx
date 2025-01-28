import './EditorButton.css';

export const EditorButton = ({ isActive }) => {

    function handleClick() {
        //todo
    }

    return (
        <button
            className="editor-button"
            style={{
                color: isActive ? 'white' : '#959eba',
                backgroundColor: isActive ? '#303242' : '#4a4859',
                borderTop: isActive ? 'border-top: 1px solid rgb(114, 187, 255)' : 'none'
            }}
            onClick={handleClick}
        >
            file.js
        </button>
    )
}