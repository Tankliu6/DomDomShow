import React, {useRef, useState} from "react";
import styled from "styled-components";
import { HiMinusSm, HiPlusSm, HiOutlinePaperClip } from "react-icons/hi";
import { CirclePicker } from "react-color";
import { GiPlainCircle } from "react-icons/gi";
import { FaBold, FaTools } from "react-icons/fa";
import { AiFillPushpin } from "react-icons/ai";
import { BiMessageDetail } from "react-icons/bi";

function ToolBar(props){
    const { 
        selectedCircle, 
        circles, 
        setCircles,
        useNodeToolSideBar, 
        setUseNodeToolSideBar, 
        isTexting, 
        setIsTexting, 
        useCommentBoard, 
        setUseCommentBoard,
        useCirclePackage, 
        setUseCirclePackage} = props;
    const [colorPickerActive, setColorPickerActive] = useState(false);


    function handleIsTexting(e){
        e.stopPropagation();
        setIsTexting(!isTexting);
    }

    function handlePlusFontSize(e){
        e.stopPropagation();
        const fontSize = selectedCircle.fontSize;
        if (fontSize === "24px") {
        } else if (fontSize === "20px") {
            selectedCircle.fontSize = "24px";
        } else if (fontSize === "16px") {
            selectedCircle.fontSize = "20px";
        } else if (fontSize === "14px") {
            selectedCircle.fontSize = "16px";
        } else if (fontSize === "12px") {
            selectedCircle.fontSize = "14px";
        }
        setCircles((prev) => [...prev])
    }

    function handleMinusFontSize(e){
        e.stopPropagation();
        const fontSize = selectedCircle.fontSize;
        if (fontSize === "12px") {
        } else if (fontSize === "24px") {
            selectedCircle.fontSize = "20px";
        } else if (fontSize === "20px") {
            selectedCircle.fontSize = "16px";
        } else if (fontSize === "16px") {
            selectedCircle.fontSize = "14px";
        } else if (fontSize === "14px") {
            selectedCircle.fontSize = "12px";
        }
        setCircles((prev) => [...prev])
    }

    function handleNodeColor(color){
        selectedCircle.fill = `${color.hex}`;
        selectedCircle.stroke = `${color.hex}`;
        setCircles((prev) => [...prev]);
    }

    function handleColorPickerActive(e){
        e.stopPropagation();
        setColorPickerActive(!colorPickerActive)
    }

    function handleNodeFontWeight(e){
        e.stopPropagation();
        console.log(selectedCircle.fontWeight)
        if (selectedCircle.fontWeight === "initial") {
            selectedCircle.fontWeight = "bold";
            setCircles((prev) => [...prev])
        } else {
            selectedCircle.fontWeight = "initial";
            setCircles((prev) => [...prev])
        }
    }

    function handleUseToolSideBar(e){
        e.stopPropagation();
        setUseNodeToolSideBar(!useNodeToolSideBar);
    }

    function handleUseCommentBoard(e){
        e.stopPropagation();
        setUseCommentBoard(!useCommentBoard);
        setUseCirclePackage(!useCirclePackage);
    }

    return (
        <>
            {!useNodeToolSideBar ? 
                <Wrapper className={selectedCircle.id !== "default" ? "active" : ""}>
                    <MinusFontSize className={selectedCircle.fontSize === "12px" ? "inactive" : ""} onPointerDown={handleMinusFontSize}>
                        <HiMinusSm fill={"#ffffff"} />
                    </MinusFontSize>
                    <FontSize onPointerDown={handleIsTexting}>
                        {selectedCircle.fontSize || "T"}
                    </FontSize>
                    <PlusFontSize className={selectedCircle.fontSize === "24px" ? "inactive" : ""} onPointerDown={handlePlusFontSize}>
                        <HiPlusSm  fill={"#ffffff"} />
                    </PlusFontSize>
                    <Line />
                    <FontWeight className={selectedCircle.fontWeight === "bold" ? "active" : ""} onPointerDown={handleNodeFontWeight}>
                        <FaBold size={15} fill="#ffffff"></FaBold>
                    </FontWeight>
                    <Line />
                    <ColorPickerWrapper className={colorPickerActive ? "active" : ""} onPointerDown={e => e.stopPropagation()}>
                        <ColorPicker onChangeComplete={handleNodeColor} />
                    </ColorPickerWrapper>
                    <Color onPointerDown={handleColorPickerActive}>
                        <GiPlainCircle size={20} fill={selectedCircle.fill || "#ffffff"} stroke="#000000" strokeWidth="10"></GiPlainCircle>
                        <Hint></Hint>
                    </Color>
                    <Line />
                    <Comment onPointerDown={handleUseCommentBoard}>
                        <BiMessageDetail size={20} fill="#ffffff"></BiMessageDetail>
                    </Comment>
                    <Line />
                    <Clip onPointerDown={handleUseToolSideBar}>
                        <FaTools fill="#efe1e1"></FaTools>
                    </Clip>
                </Wrapper>   
                :
                <Wrapper className={useNodeToolSideBar ? "sideBarActive" : ""}>
                    <Header>
                        <FaTools fill="#efe1e1"></FaTools>
                    </Header>
                    <MinusFontSize className={`${selectedCircle.fontSize === "12px" ? "inactive" : ""} ${useNodeToolSideBar ? "sideBarActive" : ""}`} onPointerDown={handleMinusFontSize}>
                        <HiMinusSm fill={"#ffffff"} />
                    </MinusFontSize>
                    <FontSize className={useNodeToolSideBar ? "sideBarActive" : ""} onPointerDown={handleIsTexting}>
                        {selectedCircle.fontSize || "T"}
                    </FontSize>
                    <PlusFontSize className={`${selectedCircle.fontSize === "24px" ? "inactive" : ""} ${useNodeToolSideBar ? "sideBarActive" : ""}`} onPointerDown={handlePlusFontSize}>
                        <HiPlusSm  fill={"#ffffff"} />
                    </PlusFontSize>
                    <Line className={useNodeToolSideBar ? "sideBarActive" : ""}/>
                    <FontWeight className={selectedCircle.fontWeight === "bold" ? "active" : ""} onPointerDown={handleNodeFontWeight}>
                        <FaBold size={20} fill="#ffffff"></FaBold>
                    </FontWeight>
                    <Line className={useNodeToolSideBar ? "sideBarActive" : ""}/>
                    <ColorPickerWrapper  className={`${colorPickerActive ? "active" : ""} ${useNodeToolSideBar ? "sideBarActive" : ""}`} onPointerDown={e => e.stopPropagation()}>
                        <ColorPicker className={useNodeToolSideBar ? "sideBarActive" : ""} onChangeComplete={handleNodeColor}/>
                    </ColorPickerWrapper>
                    <Color onPointerDown={handleColorPickerActive}>
                        <GiPlainCircle size={25} fill={selectedCircle.fill || "#ffffff"} stroke="#000000" strokeWidth="10"></GiPlainCircle>
                        <Hint></Hint>
                    </Color>
                    <Line className={useNodeToolSideBar ? "sideBarActive" : ""}/>
                    <Comment onPointerDown={handleUseCommentBoard}>
                        <BiMessageDetail size={20} fill="#ffffff"></BiMessageDetail>
                    </Comment>
                    <Line className={useNodeToolSideBar ? "sideBarActive" : ""}/>
                    <Clip onPointerDown={handleUseToolSideBar}>
                        <AiFillPushpin size={25} fill="#efe1e1"></AiFillPushpin>
                    </Clip>
                </Wrapper> 
            } 
        </>  
    )
}

export default ToolBar;

// styled-components
const Wrapper = styled.div`
    display: flex;
    visibility: hidden;
    position: absolute;
    align-items: center;
    top: 160px;
    padding: 10px;
    border-radius: 3px;
    height: 30px;
    width: 260px;
    background-color: var(--color-tool-background);
    opacity: 0;
    transition: 
        visibility 0.5s, 
        opacity 0.5s linear;
    &.active{
        visibility: visible;
        opacity: 1;
    }
    &.sideBarActive{
        flex-direction: column;
        visibility: visible;
        opacity: 1;
        top: 340px;
        left: 20px;
        padding: 0 10px 10px 10px;
        height: 280px;
        width: 60px;
        border-radius: 10px;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 60px;
    background-color: var(--color-tool-block);
    border-radius: 10px 10px 0 0;
    margin-bottom: 10px;
`

const FontSize = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: var(--color-tool-block);
    font-weight: 600;
    font-size: 10px;
    width: 56px;
    height: 20px;
    color: #ffffff;
    cursor: pointer;
    :hover{
        background-color: #000000;
    }
    &.sideBarActive{
        width: 36px;
        height: 36px;
    }
`

const MinusFontSize = styled(FontSize)`
    width: 36px;
    background-color: var(--color-tool-block);
    margin-right: 1px;
    &.inactive{
        background-color: #000000;
        cursor: auto;
    }
    :active{
        & path {
            fill: #ffffff;
        }
    }
    &.sideBarActive{
        font-size: 20px;
        margin-bottom: 2px;
        margin-right: 0;
    }
`

const PlusFontSize = styled(FontSize)`
    width: 36px;
    background-color: var(--color-tool-block);
    margin-left: 1px;
    &.inactive{
        background-color: #000000;
        cursor: auto;
    }
    :active{
        & path {
            fill: #ffffff;
        }
    }
    &.sideBarActive{
        font-size: 20px;
        margin-top: 2px;
        margin-left: 0;
    }
`

const Line = styled.div`
    height: 100%;
    width: 1px;
    margin: 0 5px 0 5px;
    background-color: #dad2d2;
    &.sideBarActive{
        width: 30px;
        height: 1px;
        margin: 10px 0 10px 0;
    }
`

const FontWeight = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 36px;
    cursor: pointer;
    :hover{
        background-color: #000000;
    }
    &.active{
        background-color: var(--color-purple);
    }
`

const ColorPickerWrapper = styled.div`
    display: none;
    &.active{
        display: block;
    }
    &.sideBarActive{
        position: relative;
    }
`

const ColorPicker = styled(CirclePicker)`
    position: absolute;
    box-sizing: border-box;
    align-items: center;
    width: 270px !important;
    bottom: 50px;
    right: 0;
    padding: 10px 0 0 15px;
    margin: 0 !important;
    border-radius: 5px;
    background-color: var(--color-tool-background);
    &.sideBarActive{
        width: 210px !important;
        bottom: -31px;
        right: unset;
        padding: 10px 0 0 25px;
        margin-left: 40px !important;
    }
`

const Color = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width: 36px;
    cursor: pointer;
`

const Hint = styled.div`
    position: absolute;
    background: var(--color-purple);
    clip-path: polygon(100% 0px, 100% 100%, 0px 100%, 100% 0px);
    right: 3px;
    bottom: 4px;
    width: 4px;
    height: 4px;
`

const Comment = styled(Color)`
    height: 20px;
    :hover{
        background-color: #000000;
    }
`

const Clip = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 36px;
    cursor: pointer;
    :hover{
        background-color: #000000;
    }
`
