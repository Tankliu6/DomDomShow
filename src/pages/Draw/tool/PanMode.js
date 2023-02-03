import React, {useRef, useState} from "react";
import styled from "styled-components";
import { MdOutlinePanTool } from "react-icons/md";



function PanMode(props) {
    const {
        svgPanMode, 
        setSvgPanMode,
        svgIsDragging,
        setSvgIsDragging} = props;

    const [theme, setTheme] = useState({
        background: "#ffffff",
        fill: "#4a5475"
    });
    const altRef = useRef();

    function handleSvgPanModeSwitch(){
        if (svgPanMode.grab === "grab"){
            console.log("svgnodragging")
            // setSvgIsDragging(false);
            setTheme({
                background: "#ffffff",
                fill: "#4a5475"
            })
            setSvgPanMode({
                grab: "default",
                grabbing: "default"
            })
        } else {
            console.log("svgisdragging")
            // setSvgIsDragging(true);
            setTheme({
                background: "#4a5475",
                fill: "#ffffff"
            })
            setSvgPanMode({
                grab: "grab",
                grabbing: "grabbing"
            })
        }

    }

    function handleAlt() {
        if (altRef.current.style.display != "block"){
            altRef.current.style.display = "block"
        } else {
            altRef.current.style.display = "none"
        }
    }

    return(
        <PanContainer onPointerOver={handleAlt} onPointerOut={handleAlt} onClick={handleSvgPanModeSwitch} theme={theme}>
            <Alt ref={altRef}>Pan mode</Alt>
            <Pan theme={theme}></Pan>
        </PanContainer>    
    )
}

export default PanMode;


// styled-component
const PanContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    bottom: 20px;
    right: 60px;
    background-color: ${(props) => props.theme.background || "#ffffff"};
    height: 36px;
    width: 36px;
    box-shadow: 0 0 5px #cccccc;
    border-radius: 5px;
    cursor: pointer;
`

const Pan = styled(MdOutlinePanTool)`
    position: relative;
    padding: 5px;
    width: 36px;
    height: 36px;
    fill: ${(props) => props.theme.fill || "#ffffff"};
`

const Alt = styled.div`
    display: none;
    position: absolute;
    bottom: 45px;
    width: 90px;
    text-align: center;
    background-color: #414a65;
    border-radius: 3px;
    padding: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #ffffff;
`