import React, { useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { BiChalkboard } from "react-icons/bi";
import { BsArrowUpRight } from "react-icons/bs";
import Remove from "./Remove";

function Aside(props){
    const {
        svgRef, 
        circles, 
        setCircles, 
        lines, 
        setLines, 
        selectedCircle, 
        setSelectedCircle, 
        focusingLine, 
        setFocusingLine, 
        setUseCirclePackage, 
        setNodeIsDragging,
        setSelectedLines,
        setSelectedLines2, 
        setLineIsDragging} = props;
    const [canAddNewNode, setCanAddNewNode] = useState(false);
    const [canAddNewLine, setCanAddNewLine] = useState(false);
    const [hintForAddCircle, setHintForAddCircle] = useState(false);
    const [hintForRemove, setHintForRemove] = useState(false);
    const [hintForAddLine, setHintForAddLine] = useState(false);

    function handleAddNodeDown(e){
        setNodeIsDragging(true);
        setCanAddNewNode(true);
        setSelectedLines([]); // 清除上一個node可移動的線段
        setSelectedLines2([]);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
        setUseCirclePackage(false);
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
            const newCircle = {
                id: uuid(),
                cx: startSVGPoint.x,
                cy: startSVGPoint.y,
                r: 20,
                content: "",
                title: "",
                fontSize: "12px",
                fontWeight: "initial",
                fill: "#ffffff",
                stroke: "#ffffff",
                lineStroke: "#443755",
            };
            setCircles([...circles, newCircle]);
            setSelectedCircle(newCircle);
            setCanAddNewNode(false);
            setUseCirclePackage(false);
        }
    }

    function handleAddLineDown(e){
        setCanAddNewLine(true);
        setLineIsDragging(true);
        setSelectedLines([]); // 清除上一個node可移動的線段
        setSelectedLines2([]);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
        setUseCirclePackage(false);
    }

    function handleAddLineLeave(e){
        const CTM = svgRef.current.getScreenCTM().inverse();
        const svgPoint = svgRef.current.createSVGPoint();
        //  1. 滑鼠當前 viewport 中 client 座標值
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;

        //  2. 計算對應回去的 SVG 座標值
        const startSVGPoint = svgPoint.matrixTransform(CTM);

        console.log(canAddNewLine)
        if (canAddNewLine) {
            console.log("add")
            const newLine = {
                id: uuid(),
                // 開始節點 id
                startNodeId: "",
                // 終點節點 id
                endNodeId: "",
                // M x1 y1
                x1: startSVGPoint.x,
                y1: startSVGPoint.y,
                // C cpx1 cpy1, cpx2 cpy2, x2 y2
                cpx1:startSVGPoint.x + 25,
                cpy1:startSVGPoint.y - 12.5,
                cpx2:startSVGPoint.x + 75,
                cpy2:startSVGPoint.y - 37.5,
                x2: startSVGPoint.x + 100,
                y2: startSVGPoint.y - 50,
            };
            setFocusingLine(newLine);
            setLines([...lines, newLine]);
            setCanAddNewLine(false);
            console.log(newLine)
        }
    }

    function handleAltOver(e){
        setHintForAddCircle(true);
    }

    function handleLineAltOver(e){
        setHintForAddLine(true);
    }

    function handleAltLeave(e){
        setHintForAddCircle(false);
        setHintForRemove(false);
        setHintForAddLine(false);
    }

    return (
        <Container>
            <Header>
                <BiChalkboard size={25} fill="#efe1e1"></BiChalkboard>    
            </Header>
            <Wrapper onPointerLeave={(e) => {
                handleAddNodeLeave(e); 
                handleAddLineLeave(e);
            }}>
                {hintForAddCircle ? <Alt>Drag and Add Node</Alt> : ""}
                <AddCircle onPointerDown={handleAddNodeDown} onPointerOver={handleAltOver} onPointerLeave={handleAltLeave}>
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
                {hintForAddLine ? <Alt className="AddLine">Drag and Add Line</Alt> : ""}
                <AddLine onPointerDown={handleAddLineDown} onPointerOver={handleLineAltOver} onPointerLeave={handleAltLeave}>
                    <BsArrowUpRight size={25} fill="#ffffff"></BsArrowUpRight>
                </AddLine>
                <Line />
                {hintForRemove ? <Alt className="remove">Delete Selected Node <Span>Delete</Span></Alt> : ""}
                <Remove
                    id="Remove"
                    circles={circles}
                    setCircles={setCircles}
                    lines={lines}
                    setLines={setLines}
                    selectedCircle={selectedCircle}
                    setSelectedCircle={setSelectedCircle}
                    focusingLine={focusingLine}
                    setFocusingLine={setFocusingLine}
                    setUseCirclePackage={setUseCirclePackage}
                    setHintForRemove={setHintForRemove}
                />
            </Wrapper>
        </Container>
    )
}

export default Aside;


// styled-components
const Container = styled.div`
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10+ */
    user-select: none;
    position: absolute;
    left: 20px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 60px;
    height: 192px;
    padding-bottom: 10px;
    background-color: var(--color-tool-background);
    border-radius: 10px;
`

const Wrapper = styled.div`
    margin-top: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 50px;
    padding-bottom: 10px;
    background-color: var(--color-tool-background);
    border-radius: 10px;
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 60px;
    background-color: var(--color-tool-block);
    border-radius: 10px 10px 0 0;
`

const AddCircle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: grab;
    :active{
        cursor: grabbing;
    }
`

const AddLine = styled(AddCircle)`
    :hover{
        margin-left: 4px;
    }
`

const Svg = styled.svg`
    :hover{
        margin-left: 4px;
    }
`

const Circle = styled.circle`
    fill: #ffffff;
`

const Rect = styled.rect`
    pointer-events: none;
    fill: #cccccc;
`

const Line = styled.div`
    pointer-events: "none";
    height: 1px;
    width: 30px;
    background-color: #dad2d2;
    opacity: 0.8;
`

const Alt = styled.div`
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10+ */
    user-select: none;
    position: absolute;
    bottom: 120px;
    left: 75px;
    width: 150px;
    text-align: center;
    background-color: #414a65;
    border-radius: 3px;
    padding: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
    &.remove{
        width: 200px;
        bottom: 20px;
    }
    &.AddLine{
        bottom: 70px;
        word-spacing: 3px;
        user-select: none;
    }
`

const Span = styled.span`
    padding: 1px;
    border-radius: 2px;
    color: #696b73;
    background-color: #cccccc;
    width: 45px;
    margin-left: 5px;
`