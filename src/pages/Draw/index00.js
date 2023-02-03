import React, { useRef, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import media from "../../global/constant/media";
import PanMode from "./tool/PanMode";

function SvgCanvas() {
    const svgRef = useRef(null);
    const circleRef = useRef(null);
    const dragTypeRef = useRef(null);
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [viewBox, setViewBox] = useState("0 0 960 540");
    const [svgIsDragging, setSvgIsDragging] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [svgPanMode, setSvgPanMode] = useState({grab: "default", grabbing: "default"});

    function handleAddCircle() {
        const [x, y, width, height] = viewBox.split(" ");
        // console.log(x, y, width, height);
        const newCircle = {
            id: uuid(),
            cx: Number(width / 2) + Number(x),
            cy: Number(height / 2) + Number(y),
            r: 40,
        };
        setCircles([...circles, newCircle]);
    }    

    // function handleSvgCanvasClick() {
    //     console.log("svgClick")
    //     svgRef.current.removeEventListener("pointermove", handleSvgCanvasDrag, {passive: true});
    //     svgRef.current.removeEventListener("pointerdown", resetSvgCanvas, {passive: true});
    // }

    function handleSvgCanvasMouseDown(e){
        console.log("svgDown", svgPanMode)
        setSvgIsDragging(true);
        if (svgPanMode.grab === "grab") {
            console.log("svgDownAdd")
            svgRef.current.addEventListener("pointermove", handleSvgCanvasDrag);
            svgRef.current.addEventListener("pointerup", handleSvgCanvasMouseUp, {once: true});    
        }
    }

    function handleSvgCanvasDrag(e){
        console.log("svgMoveAddNotWork")
        if (svgIsDragging && svgPanMode.grab === "grab"){
            console.log("moving")
            // 1. 取得一開始的 viewBox 值，原本是字串，拆成陣列，方便之後運算
            let [x, y, width, height] = viewBox.split(" ");

            //  2. 取得滑鼠當前 viewport 中 client 座標值
            let startClient = {
                x: e.clientX,
                y: e.clientY,
            }

            //  3. 計算對應回去的 SVG 座標值
            let newSVGPoint = svgRef.current.createSVGPoint();
            let CTM = svgRef.current.getScreenCTM();
            newSVGPoint.x = startClient.x;
            newSVGPoint.y = startClient.y;
            let startSVGPoint = newSVGPoint.matrixTransform(CTM.inverse())

            //  4. 計算拖曳後滑鼠所在的 viewport client 座標值
            let moveToClient = {
                x: e.clientX + e.movementX, // movement 可以取得滑鼠位移量
                y: e.clientY + e.movementY
            }

            // 5. 計算對應回去的 SVG 座標值
            newSVGPoint = svgRef.current.createSVGPoint()
            CTM = svgRef.current.getScreenCTM()
            newSVGPoint.x = moveToClient.x
            newSVGPoint.y = moveToClient.y
            let moveToSVGPoint = newSVGPoint.matrixTransform(CTM.inverse())

            //  6. 計算位移量
            let delta = {
                dx: startSVGPoint.x - moveToSVGPoint.x,
                dy: startSVGPoint.y - moveToSVGPoint.y
            }

            // console.log(`${Number(x) + Number(delta.dx)} ${Number(y) + Number(delta.dy)} ${width} ${height}`)
            //  7. 設定新的 viewBox 值
            setViewBox(
                `${Number(x) + Number(delta.dx)} ${Number(y) + Number(delta.dy)} ${width} ${height}`
            )
            // console.log(viewBox)
        }
    }
    
    function handleSvgCanvasMouseUp(){
        console.log("svgUp")
        svgRef.current.removeEventListener("pointermove", handleSvgCanvasDrag, {passive: true});
        setSvgIsDragging(false);
    }

    function handleCircleClick(e){
        e.stopPropagation();
        console.log("click")
        svgRef.current.removeEventListener("pointermove", handleCircleMouseMove, {passive:true});
        if (isDragging && e.target.id === selectedCircle) {
            console.log("hi")
            svgRef.current.removeEventListener("pointerdown", handleCircleMouseDown, {passive:true});
            svgRef.current.removeEventListener("pointerup", handleCircleMouseUp, {passive: true});    
        }
    }

    function handleCircleMouseDown(e) {
        const id = e.target.id;
        console.log("down");
        setIsDragging(true);
        setSelectedCircle(e.target.id);
        const CTM = circleRef.current.getScreenCTM();
        setMousePosition({
            x: Number((e.clientX - CTM.e) / CTM.a) - e.target.cx.baseVal.value,
            y: Number((e.clientY - CTM.f) / CTM.d) - e.target.cy.baseVal.value 
        })
        // 避免圓形閃現的問題
        if (id === selectedCircle) {
            svgRef.current.addEventListener("pointermove", handleCircleMouseMove);
        }
        e.target.addEventListener("click", handleCircleClick, {once: true});
        e.stopPropagation();
    }
    
    function handleCircleMouseMove(e){
        e.stopPropagation();
        console.log("circle move")
        svgRef.current.addEventListener("pointerup", handleCircleMouseUp, {once: true});
        const selected = circles.find((c) => c.id === selectedCircle);
        if (!selected) return
        if (isDragging) {
            // 設定新的 circle 於 SVG 的座標
            const CTM = e.target.getScreenCTM();
            selected.cx = (e.clientX - CTM.e) / CTM.a - mousePosition.x;
            selected.cy = (e.clientY - CTM.f) / CTM.d - mousePosition.y;
            setCircles([...circles]);
        }
    }
            
    function handleCircleMouseUp(e) {
        e.stopPropagation();
        console.log("leave");
        setIsDragging(false);
        setSelectedCircle(null);
        svgRef.current.removeEventListener("pointerdown", handleCircleMouseDown, {passive:true});
        svgRef.current.removeEventListener("pointermove", handleCircleMouseMove, {passive:true});
        svgRef.current.removeEventListener("pointerup", handleCircleMouseUp, {passive: true});
    }

    // zoom-in and zoom-out
    function handleWheel(event) {
        if(event.ctrlKey || event.metaKey){
            let width, height, x, y;
            [x, y, width, height] = viewBox.split(" ").map(Number);
            const delta = event.deltaY < 0 ? 1.1 : (1/1.1);
            width *= delta;
            height *= delta;
            setViewBox(`${x} ${y} ${Math.round(width)} ${Math.round(height)}`);
        }
    }
        

    document.addEventListener('wheel', function(event) {
        if ((event.ctrlKey === true || event.metaKey === true) && (event.deltaY > 0 || event.deltaY < 0)) {
          event.preventDefault();
        }
      }, {passive: false});
    
    // useEffect(() => {
    //     console.log("effect")
        // svgRef.current.addEventListener("pointerdown",resetSvgCanvas);
        // svgRef.current.addEventListener("pointerdown", handleSvgCanvasMouseDown);
    //     svgRef.current.addEventListener("pointermove", handleSvgCanvasDrag);
    //     svgRef.current.addEventListener("pointerup", handleSvgCanvasMouseUp);
    // }, [])
      
    function resetSvgCanvas(e){
        setSelectedCircle(null);
        console.log("reset")
        svgRef.current.removeEventListener("pointerdown", handleCircleMouseDown, {passive:true});
        svgRef.current.removeEventListener("pointermove", handleCircleMouseMove, {passive:true});
        svgRef.current.removeEventListener("pointerup", handleCircleMouseUp, {passive: true});
        console.log(svgPanMode.grab)
        // if (svgPanMode.grab === "grab") {
        //     console.log("註冊 grab")
        //     svgRef.current.addEventListener("pointerdown", handleSvgCanvasMouseDown, {once: true});
        //     svgRef.current.addEventListener("pointermove", handleSvgCanvasDrag);
        //     svgRef.current.addEventListener("pointerup", handleSvgCanvasMouseUp, {once: true});
        //     svgRef.current.addEventListener("click", handleSvgCanvasClick, {once: true});
        // } else if (svgPanMode.grab === "default") {
        //     console.log("註冊 default")
        //     svgRef.current.removeEventListener("pointerdown", handleSvgCanvasMouseDown, {passive:true});
        //     console.log(1)
        //     svgRef.current.removeEventListener("pointermove", handleSvgCanvasDrag, {passive:true});
        //     console.log(2)
        //     svgRef.current.removeEventListener("pointerup", handleSvgCanvasMouseUp, {passive:true});
        //     console.log(3)
        // }
    }
    
    function drag(){
        if (draggingType = SVG_DRAG_TYPE_CANVAS) {
            console.log(draggingType)
        }
    }
    // console.log(svgPanMode)
    return (
        <Main>
            <Aside>
                <button onClick={handleAddCircle}>Add Circle</button>
            </Aside>
            <Svg
                tabIndex={-1}
                id="svg"
                className="svg"
                ref={svgRef}
                viewBox={viewBox}
                xmlns="http://www.w3.org/2000/svg"
                panMode={svgPanMode}
                onWheel={handleWheel}
                // onPointerDown={(e) => handleCircleMouseDown(e)}
                // onPointerMove={handleCircleMouseMove}
                // onPointerUp={handleCircleMouseUp}
                onKeyDown={e => console.log(e.code)}
                onPointerDown={() => {
                    handleSvgCanvasMouseDown();
                    resetSvgCanvas();
                }}
                onPointerMove={handleSvgCanvasDrag}
                onPointerUp={handleSvgCanvasMouseUp}
                // onClick={resetSvgCanvas}
                // onPointerDown={resetSvgCanvas}
            >
                {circles.map((circle) => (
                    <CircleSvgWrapper key={circle.id}>
                        <CircleSvg
                            ref={circleRef}
                            cx={circle.cx}
                            cy={circle.cy}
                            r={circle.r}
                            id={circle.id}
                            fill={
                                circle.id === selectedCircle
                                    ? "red"
                                    : "black"
                            }
                            // onClick={handleCircleClick}
                            onPointerDown={(e) => handleCircleMouseDown(e)}
                            // onPointerMove={handleCircleMouseMove}
                            // onPointerUp={handleCircleMouseUp}
                        />
                        <foreignObject
                            style={{pointerEvents: "none"}} // 讓下方圓形可以被點擊
                            x={circle.cx - (circle.r) / 2 } 
                            y={circle.cy - (circle.r) / 2 }
                            width={circle.r} 
                            height={circle.r}
                            >
                            <div>123</div>
                        </foreignObject>
                    </CircleSvgWrapper>
                ))}
            </Svg>
            <PanMode 
                svgRef={svgRef}
                svgPanMode={svgPanMode} 
                setSvgPanMode={setSvgPanMode}
                svgIsDragging={svgIsDragging}
                setSvgIsDragging={setSvgIsDragging}
                handleSvgCanvasMouseDown={handleSvgCanvasMouseDown}
                handleSvgCanvasDrag={handleSvgCanvasDrag}
                handleSvgCanvasMouseUp={handleSvgCanvasMouseUp}
                viewBox={viewBox}
                setViewBox={setViewBox}
            >
            </PanMode>
        </Main>
    )
}

export default SvgCanvas;

// style-components
const Main = styled.div`
    display: flex;
`;

const Aside = styled.aside`
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #ffbb00;
    /* border: 0.5px solid #000000; */
    box-shadow: 0 0 1px #000000;
    width: 212px;
    min-height: calc(100vh - 105px);
    margin-top: 0.5px;
    button {
        color: #000000;
        background-color: #ffffff;
        border: 2px solid #000000;
        box-shadow: 0 2px #000000;
        padding: 10px;
        margin-right: 10px;
        border-radius: 20px;
        font-weight: 800;
        cursor: pointer;
        :hover {
            box-shadow: 0 0px #000000;
        }
    }
`;

const Svg = styled.svg`
    cursor: ${props => props.panMode.grab};
    border: 1px solid #cccccc;
    background-color: var(--color-SVG-background-gray);
    height: calc(100vh - 105px);
    width: 100%;
    outline: none;
    :active{
        cursor: ${props => props.panMode.grabbing};
    }
`;

const CircleSvgWrapper = styled.g`
    width: 100px;
    height: 100px;
`

const CircleSvg = styled.circle`
    cursor: move;
`