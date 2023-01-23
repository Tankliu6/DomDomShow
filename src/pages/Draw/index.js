import React, { useState } from "react";
import styled from "styled-components";

function Drawing() {
    const [points, setPoints] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    function handleMouseDown(e) {
        setPoints([...points, { x: e.clientX - 30, y: e.clientY - 140 }]);
        console.log(e.clientX - 30);
        setIsDrawing(true);
    }

    function handleMouseMove(e) {
        if (isDrawing) {
            setPoints([...points, { x: e.clientX - 30, y: e.clientY - 140 }]);
        }
    }

    function handleMouseUp() {
        setIsDrawing(false);
    }

    function handleClear() {
        setPoints([]);
    }

    return (
        <>
            <Clean onClick={handleClear}>Clean</Clean>
            <Svg
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {points.map((point, i) => (
                    <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r={5}
                        fill="black"
                    />
                ))}
            </Svg>
        </>
    );
}

export default Drawing;

// style-components
const Svg = styled.svg`
    border: 1px solid;
    height: calc(100vh - 150px);
    width: 500px;
`;

const Clean = styled.button`
    padding: 10px;
    height: 30px;
    width: 30px;
    background-color: #cccccc;
`;
