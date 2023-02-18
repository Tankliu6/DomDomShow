import React from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import { BiChalkboard } from "react-icons/bi";
import Remove from "./Remove";

function Aside(props){
    const { 
        viewBoxOrigin, 
        SVGSize, 
        circles, 
        setCircles, 
        lines, 
        setLines, 
        selectedCircle, 
        setSelectedCircle, focusingLine, setFocusingLine, setShowCirclePackage } = props;
    return (
        <Wrapper>
            <Header>
                <BiChalkboard size={25} fill="#efe1e1"></BiChalkboard>    
            </Header>
            <AddCircle onClick={(e) => {
                handleAddCircle(
                    e, 
                    viewBoxOrigin, 
                    SVGSize, 
                    circles, 
                    setCircles
                )
            }}>
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


function handleAddCircle(e, viewBoxOrigin, SVGSize, circles, setCircles) {
    e.stopPropagation();
    const { x, y } = viewBoxOrigin;
    const { width, height } = SVGSize;
    const newCircle = {
        id: uuid(),
        cx: width / 2 + x,
        cy: height / 2 + y,
        r: 40,
        content: "",
    };
    setCircles([...circles, newCircle]);
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
    height: 1px;
    width: 30px;
    background-color: #dad2d2;
    opacity: 0.8;
`