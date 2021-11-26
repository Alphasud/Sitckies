import { useState, useEffect } from "react";

function StickyImage(props) {
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const id = props.imageID;
    const [image, setImage] = useState(props.image);
    const [text, setText] = useState(props.text);
    const [style, setStyle] = useState(
        {
            backgroundImage: `url(${props.image})`, 
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
            image: image,
            text: text,
            id: id
        }]
        props.handleImageObj(newObj)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, id, position.y, position.x, text]);
    
    useEffect(() => {
        setStyle({
            backgroundImage: `url(${props.image})`,
            left: `${props.left}px`,
            top: `${props.top}px`,
            transform: props.tilt,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.top, props.left, props.image]);

    return (
        <div className='sticky-note'
            style={style}>
            <i className="pin">📌</i>
            <div className='header'>
                <i onClick={() => props.handleImageDelete(props.imageID)} className="fas fa-trash"></i>
                <input
                    className={isOpen ? 'sticky-image-input open' : 'sticky-image-input'}
                    id={props.imageID}
                    type="text"
                    value={image}
                    onChange={(e) => {
                        setImage(e.target.value);
                    }}
                />
                <label htmlFor={props.imageID} onClick={() => setIsOpen(!isOpen)}><i className="fas fa-images"></i></label>
            </div>
        <div className='body image'
            onPointerDown={() => setIsDraggingImage(true) }
            onPointerUp={() => {
                setIsDraggingImage(false);
            }}
            onPointerMove={(e) => isDraggingImage ? handleDragMove(e) : null}    
            >
            <textarea
            placeholder='write something...'
            type="text"
            value={props.text}
            onChange={(e) =>  setText(e.target.value) }
            >
            </textarea>
        </div>
        </div>
        
        

    );
}

export default StickyImage;