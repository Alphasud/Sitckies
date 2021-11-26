import { useState, useEffect } from "react";

function StickyNote(props) {
    const [isDragging, setIsDragging] = useState(false);
    const id = props.noteID;
    const [text, setText] = useState(props.text);
    const [color, setColor] = useState(props.color)
    const [style, setStyle] = useState(
        {
            backgroundColor: props.color,
            top: props.top,
            left: props.left,
            transform: props.tilt,
        });
    const [position, setPosition] = useState({
        x: props.left,
        y: props.top
    });

  const handleDragMove = (e) => {
    setPosition({
        x: position.x + e.movementX,
        y: position.y + e.movementY
    });
  };
    
    useEffect(() => {
        const newObj = [{
            top: position.y,
            left: position.x,
            color: color,
            text: text,
            id: id
        }]
        props.handleObj(newObj)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, id, position.y, position.x, text]);

    useEffect(() => {
        setStyle({
            backgroundColor: props.color,
            left: `${props.left}px`,
            top: `${props.top}px`,
            transform: props.tilt,
        });  
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.top, props.left, props.color]);

    const handleInput = (e) => {
        setText(e.target.value)
    }
    const handleColor = (e) => {
        setColor(e.target.value)
    }
    return (
        <div className='sticky-note'
            style={style}>
            <i className="pin">📌</i>
            <div className='header'>
                <i onClick={() => props.handleDelete(props.noteID)} className="fas fa-trash"></i>
                <input
                    className='header-input'
                    id={props.noteID}
                    type="color"
                    value={color}
                    onChange={handleColor}
                />
                <label htmlFor={props.noteID}><i className="fas fa-palette"></i></label>
            </div>
        <div className='body'
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => 
                setIsDragging(false) 
            }
            onPointerMove={(e) => isDragging ? handleDragMove(e) : null}    
        >
            <textarea
                placeholder='write something...'
                type="text"
                value={props.text}
                onInput={handleInput}
             >
            </textarea>
        </div>
        </div>
        
        

    );
}

export default StickyNote;