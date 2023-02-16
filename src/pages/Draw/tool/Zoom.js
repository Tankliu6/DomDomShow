import React, { useRef, useState } from "react";
import styled from "styled-components";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";



function Zoom(props){
    const {
        SVGSize,
        setSVGSize, 
        viewBoxOrigin, 
        setViewBoxOrigin } = props;
    const zoomPercent = Math.floor((960 / SVGSize.width) * 100);
    const zoomOutRef = useRef();
    const zoomInRef = useRef();
    const zoomPercentRef = useRef();

    // zoom-in and zoom-out 停止瀏覽器的預設放大縮小
    document.addEventListener('wheel', function(event) {
        if ((event.ctrlKey === true || event.metaKey === true) && (event.deltaY > 0 || event.deltaY < 0)) {
          event.preventDefault();
        }
      }, {passive: false});

    function handleSVGCoordination(props){
        let [ x, y, width, height, newWidth, newHeight, offsetX, offsetY ] = props;
        offsetX = (width - newWidth) * 0.5;
        offsetY = (height - newHeight) * 0.5;
        setViewBoxOrigin({ x: x + offsetX, y: y + offsetY });
        setSVGSize({ width: newWidth.toFixed(2), height: newHeight.toFixed(2) });    
    }

    function handleZoomOut(e){
        e.preventDefault();
        const { x, y } = viewBoxOrigin;
        const { width, height } = SVGSize;
        let newWidth = width * 1.1; // zoom 最大 200% 最小 50%
        let newHeight = height * 1.1;
        let offsetX = (width - newWidth) * 0.5;
        let offsetY = (height - newHeight) * 0.5;
        const percentValue = (960 / newWidth).toFixed(2);
        if (percentValue <= 0.24) {
            newWidth = 3840;
            newHeight = 2160;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 0.25 <= percentValue && percentValue <= 0.49){
            newWidth = 3840;
            newHeight = 2160;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 0.5 < percentValue && percentValue <= 0.74){
            newWidth = 1920;
            newHeight = 1080;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 0.75 <= percentValue && percentValue <= 0.99){
            newWidth = 1280;
            newHeight = 720;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 1 <= percentValue && percentValue <= 1.49){
            newWidth = 960;
            newHeight = 540;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 1.5 <= percentValue && percentValue <= 2){
            newWidth = 640;
            newHeight = 360;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 2.01 <= percentValue && percentValue <= 2.49 ){
            newWidth = 480;
            newHeight = 270;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 2.5 <= percentValue ){
            newWidth = 384;
            newHeight = 216;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        }
    }

    function handleZoomIn(e){
        e.preventDefault();
        const { x, y } = viewBoxOrigin;
        const { width, height } = SVGSize;
        let newWidth = width * 1/1.1; // zoom 最大 200% 最小 50%
        let newHeight = height * 1/1.1;
        let offsetX = (width - newWidth) * 0.5;
        let offsetY = (height - newHeight) * 0.5;
        const percentValue = (960 / newWidth).toFixed(2);
        if (percentValue < 0.49){
            newWidth = 1920;
            newHeight = 1080;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 0.5 <= percentValue && percentValue <= 0.74){
            newWidth = 1280;
            newHeight = 720;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 0.75 <= percentValue && percentValue <= 0.99){
            newWidth = 960;
            newHeight = 540;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 1 <= percentValue && percentValue <= 1.49){
            newWidth = 640;
            newHeight = 360;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 1.5 <= percentValue && percentValue <= 2){
            newWidth = 480;
            newHeight = 270;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 2.01 <= percentValue && percentValue <= 2.49){
            newWidth = 384;
            newHeight = 216;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        } else if ( 2.5 <= percentValue){
            newWidth = 320;
            newHeight = 180;
            handleSVGCoordination([x, y, width, height, newWidth, newHeight, offsetX, offsetY])  
        }
    }

    function handleZoomOutAlt() {
        if (zoomOutRef.current.style.display != "block"){
            zoomOutRef.current.style.display = "block"
        } else {
            zoomOutRef.current.style.display = "none"
        }
    }

    function handleZoomInAlt() {
        if (zoomInRef.current.style.display != "block"){
            zoomInRef.current.style.display = "block"
        } else {
            zoomInRef.current.style.display = "none"
        }
    }

    function handleZoomPercentAlt() {
        if (zoomPercentRef.current.style.display != "flex"){
            zoomPercentRef.current.style.display = "flex"
        } else {
            zoomPercentRef.current.style.display = "none"
        }
    }

    return (
        <Wrapper>
            <ZoomOut onPointerOver={handleZoomOutAlt} onPointerOut={handleZoomOutAlt} onClick={handleZoomOut}>
                <FaSearchMinus />
                <ZoomOutAlt ref={zoomOutRef}>Zoom out</ZoomOutAlt>
            </ZoomOut>
            <Percent onPointerOver={handleZoomPercentAlt} onPointerOut={handleZoomPercentAlt}>
                {zoomPercent + "%"}
                <PercentAlt ref={zoomPercentRef}>
                    Zoom 
                    <P>Ctrl</P> 
                    <P>Scroll</P>
                </PercentAlt>
            </Percent>
            <ZoomIn onPointerOver={handleZoomInAlt} onPointerOut={handleZoomInAlt} onClick={handleZoomIn}>
                <FaSearchPlus />
                <ZoomInAlt ref={zoomInRef}>Zoom In</ZoomInAlt>
            </ZoomIn>
        </Wrapper>
    )
}

// ctrl + 滾輪的 zoom-in and zoom-out
function handleWheel(e, svgRef, viewBoxOrigin, SVGSize, setSVGSize, setViewBoxOrigin) {
    if (e.ctrlKey || e.metaKey) {
        const { x, y } = viewBoxOrigin;
        const { width, height } = SVGSize;
        const delta = e.deltaY > 0 ? 1.1 : 1/1.1;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        let newWidth = width * delta; // zoom 最大 200% 最小 50%
        let newHeight = height * delta;
        let offsetX = (width - newWidth) * (mouseX / svgRef.current.clientWidth);
        let offsetY = (height - newHeight) * (mouseY / svgRef.current.clientHeight);
        if ((960 / newWidth).toFixed(2) < 0.24){
            newWidth = 3840;
            newHeight = 2160;
            offsetX = (width - newWidth) * (mouseX / svgRef.current.clientWidth);
            offsetY = (height - newHeight) * (mouseY / svgRef.current.clientHeight);
            setViewBoxOrigin({ x: x + offsetX, y: y + offsetY });
            setSVGSize({ width: newWidth.toFixed(2), height: newHeight.toFixed(2) });    
        } else if ((960 / newWidth).toFixed(2) > 3){
            newWidth = 320;
            newHeight = 180;
            offsetX = (width - newWidth) * (mouseX / svgRef.current.clientWidth);
            offsetY = (height - newHeight) * (mouseY / svgRef.current.clientHeight);
            setViewBoxOrigin({ x: x + offsetX, y: y + offsetY });
            setSVGSize({ width: newWidth.toFixed(2), height: newHeight.toFixed(2) });    
        } else {
            setViewBoxOrigin({ x: x + offsetX, y: y + offsetY });
            setSVGSize({ width: newWidth.toFixed(2), height: newHeight.toFixed(2) });    
        }
    }
} 



export default Zoom;
export { handleWheel }; 

// styled-components
const Wrapper = styled.div`
    display: flex;
`

const Percent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    align-items: center;
    text-align: center;
    bottom: 20px;
    right: 146px;
    background-color: #ffffff;
    color: ${props => props.color || "#4a5475"};
    font-weight: 800;
    height: 36px;
    width: 76px;
    cursor: pointer;
`

const ZoomOut = styled(Percent)`
    width: 36px;
    right: 223px;
    border-radius: 5px 0 0 5px;
    :active{
        background-color: #4a5475;
        & path {
            fill: #ffffff;
        }
    }
`

const ZoomIn = styled(Percent)`
    width: 36px;
    right: 109px;
    border-radius: 0 5px 5px 0;
    :active{
        background-color: #4a5475;
        & path {
            fill: #ffffff;
        }
    }
`
const ZoomOutAlt = styled.div`
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

const ZoomInAlt = styled(ZoomOutAlt)`
`

const PercentAlt = styled(ZoomOutAlt)`
    /* display: flex; */
    justify-content: center;
    align-items: center;
    width: 148px;
    gap: 10px;
`

const P = styled.p`
    padding: 1px;
    border-radius: 2px;
    color: #696b73;
    background-color: #cccccc;
`