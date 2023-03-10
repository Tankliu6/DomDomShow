import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { MdOutlinePanTool } from "react-icons/md";

function PanMode(props) {
    const {
        svgPanMode, 
        setSvgPanMode,
        setSvgIsDragging} = props;

    const [theme, setTheme] = useState({
        background: "#ffffff",
        fill: "#4a5475"
    });
    const altRef = useRef();
    const location = useLocation();

    function handleSvgPanModeSwitch(){
        if (svgPanMode.grab === "grab"){
            setSvgIsDragging(false);
            setTheme({
                background: "#ffffff",
                fill: "#4a5475"
            })
            setSvgPanMode({
                grab: "default",
                grabbing: "default"
            })
        } else {
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
        if (altRef.current.style.display != "flex"){
            altRef.current.style.display = "flex"
        } else {
            altRef.current.style.display = "none"
        }
    }

    // 按壓 Space 手勢 SVG 畫布拖拉模式
    useEffect(() => {
        function handleSpaceKeydown(e) {
            if (e.code === "Space" && e.target.id.split("-")[0] !== "nodeContent") {
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
        function handleSpaceKeyUp(e){
            if (e.code === "Space" && e.target.id.split("-")[0] !== "nodeContent") {
                setTheme({
                    background: "#ffffff",
                    fill: "#4a5475"
                })
                setSvgPanMode({
                    grab: "default",
                    grabbing: "default"
                })
            }
        }
        document.addEventListener("keydown", handleSpaceKeydown);
        document.addEventListener("keyup", handleSpaceKeyUp);
    }, []);

    return(
        <PanContainer 
            className={location.pathname === "/" ? "welcomePage" : ""} 
            onPointerOver={handleAlt} 
            onPointerOut={handleAlt} 
            onClick={handleSvgPanModeSwitch} theme={theme}
        >
            <Alt ref={altRef}>
                Pan mode 
                <P>Space</P>
            </Alt>
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
    &.welcomePage {
        display: none;
    }
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
    flex-direction: column;
    align-items: center;
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

const P = styled.p`
    padding: 1px;
    border-radius: 2px;
    color: #696b73;
    background-color: #cccccc;
    margin-top: 2px;
    width: 70px;
    text-align: center;
`