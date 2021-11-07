import { useState, useEffect } from "react";

function StickyNote(props) {
    const max = 10;
    const min = -10;
    const tilt = `rotate(${Math.floor(Math.random() * (max - min + 1)) + min}deg)`;
    const [isDragging, setIsDragging] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const id = props.imageID;
    const [image, setImage] = useState(props.image)
    const [style, setStyle] = useState(
        {
            backgroundImage: `url(${props.image})`, 
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
        backgroundImage: `url(${image})`,
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
    });
  };
    
    useEffect(() => {
        const newObj = [{
            top: translate.y,
            left: translate.x,
            image: image,
            id: id
        }]
        props.handleImageObj(newObj)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image, id, translate.y, translate.x]);

    
    return (
        <div className='sticky-image'
            style={style}>
            <i className="pin">📌</i>
            <div className='sticky-image-header'>
                <i onClick={() => props.handleImageDelete(props.imageID)} className="fas fa-trash"></i>
                <input
                    className={isOpen ? 'sticky-image-input open' : 'sticky-image-input'}
                    id={props.imageID}
                    type="text"
                    value={image}
                    onInput={(e) => {
                        setImage(e.target.value);
                        setStyle({ backgroundImage: `url(${e.target.value})`, transform: `translateX(${translate.x}px) translateY(${translate.y}px)` })
                    }}
                />
                <label htmlFor={props.imageID} onClick={() => setIsOpen(!isOpen)}><i className="fas fa-images"></i></label>
            </div>
        <div className='sticky-image-body'
                onPointerDown={() => setIsDragging(true) }
                onPointerUp={() => {
                    setIsDragging(false);
                    setStyle({backgroundImage: `url(${image})`, transform: `translateX(${translate.x}px) translateY(${translate.y}px) rotate(${Math.floor(Math.random() * (max - min + 1)) + min}deg)`})
                }}
            onPointerMove={(e) => isDragging ? handleDragMove(e) : null}    
        >
        </div>
        </div>
        
        

    );
}

export default StickyNote;