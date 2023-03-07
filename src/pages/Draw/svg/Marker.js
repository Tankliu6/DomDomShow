import React from "react";

function Marker(){
    return (
    <defs>
        <marker 
            id="startNodeCircle" 
            markerWidth={4}
            markerHeight={4}
            refX={2}
            refY={2}
        >
            <circle
                cx={2}
                cy={2}
                r={1}
                strokeWidth={0.5}
                stroke="#675e8f"
                fill="#ffffff"
            />
        </marker>
        <marker 
            id="endNodeArrow" 
            markerWidth={6}
            markerHeight={6}
            refX={5}
            refY={3}
            orient="auto"
        >
            <polyline
                points="1,1 5,3, 1,5"
                strokeWidth={1}
                strokeLinecap="round"
                stroke="#675e8f"
                fill="none"
            />
        </marker>
    </defs> 
    )
}

export default Marker;

