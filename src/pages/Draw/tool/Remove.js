import React from "react";
import styled from "styled-components";
import { button } from "../../../global/constant/style";
import { TbTrashOff } from "react-icons/tb";
import { FaTrash } from "react-icons/fa";
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
        setShowCirclePackage } = props;
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
                        setShowCirclePackage
                    }
                )
            }}
        />  
    )
}


// 刪除節點與由此節點出發的線段
function handleRemoveNode(e, props) {
    const { selectedCircle, setSelectedCircle, circles, setCircles, lines, setLines, focusingLine, setFocusingLine, setShowCirclePackage } = props;
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
        setCircles([...circles]);
        setLines([...lines]);       
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0}); // 關閉圓形節點的工具組
        setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0}); // 關閉曲線調整工具
        setShowCirclePackage(false);
    } else if (e.code === "Delete" && focusingLine || e.type === "click" && focusingLine) {
        const lineIndex = lines.indexOf(focusingLine);
        if (lineIndex > -1) {
            lines.splice(lineIndex, 1);
            setLines([...lines]);
            setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0}); // 關閉曲線調整工具
            setShowCirclePackage(false);
        };
    }
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