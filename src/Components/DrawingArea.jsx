import { React, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useState, useRef } from 'react';

const DrawingArea = (props) => {

    const [lines, setLines] = useState([]);
    const isDrawing = useRef(false);
    const [tool, setTool] = useState('pen');
    console.log(lines);
    useEffect(() => {
        props.paint ? setTool('eraser') : setTool('pen');
        if (props.erase) setLines([]);
    }, [props.paint, props.erase]);
    
    const handleMouseDown = (e) => {
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        setLines([...lines, { tool, points: [pos.x, pos.y] }]);
    };
    
    const handleMouseMove = (e) => {
        // no drawing - skipping
        if (!isDrawing.current) {
          return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
    
        // To draw line
        let lastLine = lines[lines.length - 1];
        
        if(lastLine) {
            // add point
            lastLine.points = lastLine.points.concat([point.x, point.y]);
                
            // replace last
            lines.splice(lines.length - 1, 1, lastLine);
            setLines(lines.concat());
        }
        
    };
    
    const handleMouseUp = () => {
        isDrawing.current = false;
    };
  
    return (
        <div className="text-center text-dark paint">
            <Stage
                width={960}
                height={720}
                onMouseDown={handleMouseDown}
                onMousemove={handleMouseMove}
                onMouseup={handleMouseUp}
                className="canvas-stage"
            >
                <Layer>
                    {lines.map((line, i) => (
                        <Line
                        key={i}
                        points={line.points}
                        stroke={props.penColor}
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        globalCompositeOperation={
                            line.tool === 'eraser' ? 'destination-out' : 'source-over'
                        }
                        />
                    ))}
                </Layer>
            </Stage>
        </div>
    )
}

export default DrawingArea