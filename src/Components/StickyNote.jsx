import { useState, useEffect } from "react";

function StickyNote(props) {
    const max = 10;
    const min = -10;
    const tilt = `rotate(${Math.floor(Math.random() * (max - min + 1)) + min}deg)`;
    const [isDragging, setIsDragging] = useState(false);
    const id = props.noteID;
    const [text, setText] = useState(props.text);
    const [color, setColor] = useState(props.color)
    const [style, setStyle] = useState(
        {
            backgroundColor: props.color,
            top: props.top,
            left: props.left,
            transform: tilt,
        });
    const [translate, setTranslate] = useState({
        x: props.left,
        y: props.top
    });

  const handleDragMove = (e) => {
    setTranslate({
        x: translate.x + e.movementX,
        y: translate.y + e.movementY
    });
    setStyle({
        backgroundColor: color,
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
    });
  };
    
    useEffect(() => {
        const newObj = [{
            top: translate.y,
            left: translate.x,
            color: color,
            text: text,
            id: id
        }]
        props.handleObj(newObj)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color, id, translate.y, translate.x, text]);

    
    return (
        <div className='sticky-note'
            style={style}>
            <div className='header'>
                <i onClick={() => props.handleDelete(props.noteID)} className="fas fa-trash"></i>
                <input
                    id={props.noteID}
                    type="color"
                    value={color}
                    onChange={(e) => {
                        setColor(e.target.value);
                        setStyle({ backgroundColor: e.target.value, transform: `translateX(${translate.x}px) translateY(${translate.y}px)` })
                    }}
                />
                <label htmlFor={props.noteID}><i className="fas fa-palette"></i></label>
            </div>
        <div className='body'
            onPointerDown={() => setIsDragging(true)}
                onPointerUp={() => {
                    setIsDragging(false);
                    setStyle({backgroundColor: color, transform: `translateX(${translate.x}px) translateY(${translate.y}px) rotate(${Math.floor(Math.random() * (max - min + 1)) + min}deg)`})
                }}
            onPointerMove={(e) => isDragging ? handleDragMove(e) : null}    
        >
            <textarea
                placeholder='write something...'
                type="text"
                value={text}
                onChange={(e) =>  setText(e.target.value) }
             >
            </textarea>
        </div>
        </div>
        
        

    );
}

export default StickyNote;