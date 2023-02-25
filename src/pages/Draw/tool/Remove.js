import React from "react";
import styled from "styled-components";
import { button } from "../../../global/constant/style";
import { TbTrashOff } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";

// 刪除節點與由此節點出發的線段
function handleRemoveNode(e, props) {
    const { selectedCircle, setSelectedCircle, circles, setCircles, lines, setLines, focusingLine, setFocusingLine, setUseCirclePackage } = props;
    if (e.code === "Delete" && selectedCircle.id !== "default" || e.type === "click" && selectedCircle.id !== "default") {
        const circleIndex = circles.indexOf(selectedCircle)
        if (circleIndex > -1) {
            circles.splice(circleIndex, 1)
        };
        const lineIndex = lines.filter(line => {
            return line.startNodeId === selectedCircle.id
        });
        lineIndex.forEach(line => {
            const lineToDeleteIndex = lines.indexOf(line);
            if (lineToDeleteIndex > -1) {
                lines.splice(lineToDeleteIndex, 1)
            }
        });
        setCircles((prev) => [...prev]);
        setLines((prev) => [...prev]);       
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0}); // 關閉圓形節點的工具組
        setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0}); // 關閉曲線調整工具
        setUseCirclePackage(false);
    } else if (e.code === "Delete" && focusingLine.id !== "default" || e.type === "click" && focusingLine.id !== "default") {
        const lineIndex = lines.indexOf(focusingLine);
        if (lineIndex > -1) {
            lines.splice(lineIndex, 1);
            setLines((prev) => [...prev]);
            setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0}); // 關閉曲線調整工具
            setUseCirclePackage(false);
        };
    }
}

function Remove(props){
    const { 
        circles, 
        setCircles, 
        lines, 
        setLines, 
        selectedCircle, 
        setSelectedCircle, 
        focusingLine, 
        setFocusingLine, 
        setUseCirclePackage, 
        setHintForRemove } = props;
    return (
        <Delete
            size={25}
            fill="#ffffff" 
            onClick={(e) => {
                handleRemoveNode(
                    e,
                    {
                        circles, 
                        setCircles, 
                        lines, 
                        setLines, 
                        selectedCircle, 
                        setSelectedCircle,
                        focusingLine,
                        setFocusingLine,
                        setUseCirclePackage
                    }
                )
            }}
            onPointerOver={e => {
                e.stopPropagation();
                setHintForRemove(true);
            }}
            onPointerOut={e => {
                e.stopPropagation();
                setHintForRemove(false);
            }}
        />  
    )
}

export default Remove;
export { handleRemoveNode };

// styled-components
const Delete = styled(FaTrash)`
    cursor: pointer;
    :hover{
        fill: #97a0bd
    }
`