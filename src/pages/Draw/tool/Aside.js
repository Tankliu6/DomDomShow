import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { BiChalkboard } from "react-icons/bi";
import Remove from "./Remove";

function Aside(props){
    const {
        svgRef, 
        viewBoxOrigin, 
        SVGSize, 
        circles, 
        setCircles, 
        lines, 
        setLines, 
        selectedCircle, 
        setSelectedCircle, 
        focusingLine, 
        setFocusingLine, 
        setShowCirclePackage, 
        setNodeIsDragging } = props;
    const [canAddNewNode, setCanAddNewNode] = useState(false);

    function handleAddNodeDown(e){
        setNodeIsDragging(true);
        setCanAddNewNode(true);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
        setShowCirclePackage(false);
    }

    function handleAddNodeLeave(e){
        const CTM = svgRef.current.getScreenCTM().inverse();
        const svgPoint = svgRef.current.createSVGPoint();
        //  1. 滑鼠當前 viewport 中 client 座標值
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;

        //  2. 計算對應回去的 SVG 座標值
        const startSVGPoint = svgPoint.matrixTransform(CTM);

        if (canAddNewNode) {
            const newCircleId = uuid();
            const newCircle = {
                id: newCircleId,
                cx: startSVGPoint.x,
                cy: startSVGPoint.y,
                r: 40,
                content: "",
            };
            setCircles([...circles, newCircle]);
            setSelectedCircle(newCircle);
            setCanAddNewNode(false);
            setShowCirclePackage(false);
        }
    }

    return (
        <Wrapper
            onPointerLeave={(e) => handleAddNodeLeave(e)} 
        >
            <Header>
                <BiChalkboard size={25} fill="#efe1e1"></BiChalkboard>    
            </Header>
            <AddCircle 
                onPointerDown={handleAddNodeDown}
            >
            <Svg width={40} height={40}>
                <Circle 
                    title="Add Node" 
                    cx={20}
                    cy={20}
                    r={18}
                >
                </Circle>
                <Rect x={5} y={18} width={8} height={4} />
                <Rect x={16} y={18} width={8} height={4} />
                <Rect x={27} y={18} width={8} height={4} />        
            </Svg>
            </AddCircle>
            <Line />
            <Remove 
               circles={circles}
               setCircles={setCircles}
               lines={lines}
               setLines={setLines}
               selectedCircle={selectedCircle}
               setSelectedCircle={setSelectedCircle}
               focusingLine={focusingLine}
               setFocusingLine={setFocusingLine}
               setShowCirclePackage={setShowCirclePackage} 
            />
        </Wrapper>
    )
}

export default Aside;


// styled-components
const Wrapper = styled.div`
    position: absolute;
    left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 60px;
    padding: 0 15px 10px 15px;
    background-color: #293845;
    border-radius: 10px;
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 60px;
    background-color: #4b5c6b;
    border-radius: 10px 10px 0 0;
`

const AddCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 45px;
    height: 40px;
    border-radius: 5px;
    cursor: pointer;
`

const Svg = styled.svg`
    :hover{
        & rect {
            fill: #ff6dd8;
        }
    }
`

const Circle = styled.circle`
    fill: #ffffff;
`

const Rect = styled.rect`
    fill: #cccccc;
`

const Line = styled.div`
    pointer-events: "none";
    height: 1px;
    width: 30px;
    background-color: #dad2d2;
    opacity: 0.8;
`