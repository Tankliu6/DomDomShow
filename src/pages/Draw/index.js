import React, { useRef, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import media from "../../global/constant/media";
import PanMode from "./tool/PanMode";
import Zoom from "./tool/Zoom";
import { 
    TbArrowBigUpLine, 
    TbArrowBigRightLine,
    TbArrowBigDownLine,
    TbArrowBigLeftLine
    } from "react-icons/tb";

function SvgCanvas() {
    const svgRef = useRef(null);
    const svgIsDraggingRef = useRef(false);
    const circleRef = useRef(null);
    const deleteRef = useRef();
    const leftRightRef = useRef(null);
    const lineAtNorthRef = useRef([]);
    const lineAtNorthRef2 = useRef([]);
    const lineAtEastRef = useRef([]);
    const lineAtEastRef2 = useRef([]);
    const lineAtSouthRef = useRef([]);
    const lineAtSouthRef2 = useRef([]);
    const lineAtWestRef = useRef([]);
    const lineAtWestRef2 = useRef([]);
    const [foreignObjectPointerEventMode, setForeignObjectPointerEventMode] = useState(false);
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState({id: "default", cx: 0, cy: 0, r: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [circleMoving, setCircleMoving] = useState(false);
    const [viewBoxOrigin, setViewBoxOrigin] = useState({ x: 0, y: 0 })
    const [SVGSize, setSVGSize] = useState({ width: 960, height: 540 })
    const [svgIsDragging, setSvgIsDragging] = useState(false);
    const [svgPanMode, setSvgPanMode] = useState({grab: "default", grabbing: "default"});
    const [lines, setLines] = useState([]);
    const [selectedLines, setSelectedLines] = useState([]);
    const [selectedLines2, setSelectedLines2] = useState([]);
    const [transformIsDragging, setTransformIsDragging] = useState(false);

    function handleAddCircle(e) {
        e.stopPropagation();
        const { x, y } = viewBoxOrigin;
        const { width, height } = SVGSize;
        const newCircle = {
            id: uuid(),
            cx: width / 2 + x,
            cy: height / 2 + y,
            r: 40,
        };
        setCircles([...circles, newCircle]);
    }    

    function handleSvgCanvasMouseDown(e){
        svgPanMode.grab === "grab" ? svgIsDraggingRef.current = true : null;
    }
    
    function handleSvgCanvasMove(e) {
        e.preventDefault();
        if (svgIsDraggingRef.current) {
            // 處理滑鼠變動量的 SVG 座標轉換
            let delta = {
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({ e, delta });
            const { x, y } = viewBoxOrigin;      
            setViewBoxOrigin({ x: x + delta.dx, y: y + delta.dy })
        }
    }
    
    function handleSvgCanvasMouseUp(){
        svgIsDraggingRef.current = false;
    }


    function handleCircleMouseDown(e) {
        e.stopPropagation();

        const id = e.target.id; // 立即於此點擊事件中找到被點擊的 id
        setIsDragging(true);
        console.log(id, selectedCircle)

        isDragging ? setCircleMoving(true) : null;

        const selected = circles.find((c) => c.id === id);
        setSelectedCircle(selected);

        const linesBindToSelectedNode = lines.filter((l) => l.id === id);
        setSelectedLines([...linesBindToSelectedNode]);

        const linesBindToSelectedNode2 = lines.filter((l) => l.id2 === id);
        setSelectedLines2([...linesBindToSelectedNode2])

        // 判斷該節點 isDragging === true 時點擊另一節點馬上能拖動的問題
        if (id === selectedCircle.id) {
            svgRef.current.addEventListener("pointerup", handleCircleMouseUp, {once: true});
        } else {
            setCircleMoving(false);
            setSelectedLines([]);
            setSelectedLines2([]);
        }
    }

    function handleCircleMouseMove(e){
        e.stopPropagation();
        e.preventDefault();
        // 處理滑鼠變動量的 SVG 座標轉換
        let delta = {
            dx: "",
            dy: ""
        }
        handleSVGCoordinateTransfer({ e, delta });
        //  6. 設定新的節點位置  
        if (!selectedCircle) return
        if (isDragging && circleMoving) {
            // 設定新的 circle 於 SVG 的座標
            selectedCircle.cx -= delta.dx
            selectedCircle.cy -= delta.dy 
            setCircles([...circles]);
            // 設定該節點的線段連接點同步移動
            // 該節點出發的線段連接點
            selectedLines.forEach(line => {
                line.x1 -= delta.dx; 
                line.y1 -= delta.dy;
                // 動態曲線點使其為直線
                line.cpx1 = (line.x1 + line.x2 - delta.dx) / 2;
                line.cpy1 = (line.y1 + line.y2 - delta.dy) / 2;
                line.cpx2 = (line.x1 + line.x2 - delta.dx) / 2;
                line.cpy2 = (line.y1 + line.y2 - delta.dy) / 2;
            })
            // 由其他節點出發至此被移動節點的線段連接點    
            selectedLines2.forEach(line => {
                line.x2 -= delta.dx;
                line.y2 -= delta.dy;
                // 動態曲線點使其為直線
                line.cpx1 = (line.x1 + line.x2 - delta.dx) / 2;
                line.cpy1 = (line.y1 + line.y2 - delta.dy) / 2;
                line.cpx2 = (line.x1 + line.x2 - delta.dx) / 2;
                line.cpy2 = (line.y1 + line.y2 - delta.dy) / 2;
            })

            setLines([...lines])
        }
    }
        
    function handleCircleMouseUp(e) {
        e.stopPropagation();
        console.log("leave");
        setIsDragging(false);
        setCircleMoving(false);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
    }

    // zoom-in and zoom-out
    function handleWheel(event) {
        if (event.ctrlKey || event.metaKey) {
            const { x, y } = viewBoxOrigin;
            const { width, height } = SVGSize;
            const delta = event.deltaY > 0 ? 1.1 : 1/1.1;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            let newWidth = width * delta; // zoom 最大 200% 最小 50%
            let newHeight = height * delta;
            let offsetX = (width - newWidth) * (mouseX / svgRef.current.clientWidth);
            let offsetY = (height - newHeight) * (mouseY / svgRef.current.clientHeight);
            if ((960 / newWidth).toFixed(2) < 0.49){
                newWidth = 1920;
                newHeight = 1080;
                offsetX = (width - newWidth) * (mouseX / svgRef.current.clientWidth);
                offsetY = (height - newHeight) * (mouseY / svgRef.current.clientHeight);
                setViewBoxOrigin({ x: x + offsetX, y: y + offsetY });
                setSVGSize({ width: newWidth.toFixed(2), height: newHeight.toFixed(2) });    
            } else if ((960 / newWidth).toFixed(2) > 2.01){
                newWidth = 480;
                newHeight = 270;
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

    // zoom-in and zoom-out 
    document.addEventListener('wheel', function(event) {
        if ((event.ctrlKey === true || event.metaKey === true) && (event.deltaY > 0 || event.deltaY < 0)) {
          event.preventDefault();
        }
      }, {passive: false});
    
    // // 刪除節點與由此節點出發的線段
    function handleRemoveNode(e){
        if (e.code === "Delete" && selectedCircle.id !== "default") {
            console.log(selectedCircle, selectedLines, selectedLines2);
            circles.splice(selectedCircle.id, 1)
            setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
            setCircles([...circles]);

            const linesNotBindToSelectedNode = lines.filter((line) => line.id != selectedCircle.id);
            setLines([...linesNotBindToSelectedNode]);
        }
    }

    // 點擊SVG畫布解除選擇節點
    function resetSvgCanvas(e){
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
    }

    // 創建新的線段節點
    function handleAddNode(e){
        e.stopPropagation();
        // console.log(selectedCircle)
        // console.log("Add Node")
        
        function handleAddEndPointCircle(props){
            const {id, x2, y2} = props;
            const newCircle = {
                id: id,
                cx: x2,
                cy: y2,
                r: 40,
            };
            setCircles([...circles, newCircle])
        }

        const endPointCircleId = uuid();

        const CTM = svgRef.current.getScreenCTM();
        const svgX = (e.clientX - CTM.e) / CTM.a;
        const svgY = (e.clientY - CTM.f) / CTM.d;
        // console.log(svgX, svgY)

        const newLine = {
            // 開始節點 id
            id: selectedCircle.id,
            // 終點節點 id
            id2: endPointCircleId,
            // M x1 y1
            x1: selectedCircle.cx,
            y1: selectedCircle.cy,
            // C cpx1 cpy1, cpx2 cpy2, x2 y2
            cpx1:selectedCircle.cx,
            cpy1:selectedCircle.cy,
            cpx2:selectedCircle.cx,
            cpy2:selectedCircle.cy,
            x2: selectedCircle.cx,
            y2: selectedCircle.cy,

        }

        if (svgX > selectedCircle.cx + selectedCircle.r) {
            // 右邊
            console.log(1)
            newLine.x1 = selectedCircle.cx + selectedCircle.r;
            // newLine.y1 = selectedCircle.cy;
            newLine.cpx1 = selectedCircle.cx + selectedCircle.r;
            newLine.cpx2 = selectedCircle.cx + selectedCircle.r;
            newLine.x2 = selectedCircle.cx + selectedCircle.r + 200;
            // newLine.y2 = selectedCircle.cy;
            handleAddEndPointCircle({
                id: newLine.id2,
                x2: selectedCircle.cx + selectedCircle.r + 240,
                y2: selectedCircle.cy
            })  
        } else if (svgX < selectedCircle.cx - selectedCircle.r) {
            // 左邊
            console.log(2)
            newLine.x1 = selectedCircle.cx - selectedCircle.r;
            newLine.cpx1 = selectedCircle.cx - selectedCircle.r;
            newLine.cpx2 = selectedCircle.cx - selectedCircle.r;
            // newLine.y1 = selectedCircle.cy;
            newLine.x2 = selectedCircle.cx - selectedCircle.r - 200;
            // newLine.y2 = selectedCircle.cy;
            handleAddEndPointCircle({
                id: newLine.id2,
                x2: selectedCircle.cx - selectedCircle.r - 240,
                y2: selectedCircle.cy
            }) 
        } else if (svgY > selectedCircle.cy + selectedCircle.r) {
            // 下
            console.log(3)
            // newLine.x1 = selectedCircle.cx;
            newLine.y1 = selectedCircle.cy + selectedCircle.r;
            newLine.cpy1 = selectedCircle.cy + selectedCircle.r;
            newLine.cpy2 = selectedCircle.cy + selectedCircle.r;
            // newLine.x2 = selectedCircle.cx;
            newLine.y2 = selectedCircle.cy + selectedCircle.r + 200;
            handleAddEndPointCircle({
                id: newLine.id2,
                x2: selectedCircle.cx,
                y2: selectedCircle.cy + selectedCircle.r + 240
            }) 
        } else if (svgY < selectedCircle.cy - selectedCircle.r) {
            // 上
            console.log(4)
            // newLine.x1 = selectedCircle.cx;
            newLine.y1 = selectedCircle.cy - selectedCircle.r;
            newLine.cpy1 = selectedCircle.cy - selectedCircle.r;
            newLine.cpy2 = selectedCircle.cy - selectedCircle.r;
            // newLine.x2 = selectedCircle.cx;
            newLine.y2 = selectedCircle.cy - selectedCircle.r - 200;
            handleAddEndPointCircle({
                id: newLine.id2,
                x2: selectedCircle.cx,
                y2: selectedCircle.cy - selectedCircle.r - 240
            }) 
        }
        setLines([...lines, newLine])
    }

    function handleTransformDown(e){
        e.stopPropagation();
        setTransformIsDragging(true);
        const id = selectedCircle.id;
        // left = true
        if (e.target.classList.contains("upperLeft") || e.target.classList.contains("lowerLeft")) {
            leftRightRef.current = true;
        } else {
            leftRightRef.current = false;
        }

        // 上
        const lineAtNorth = lines.filter((line) => line.id === id && line.y1 < selectedCircle.cy);
        // console.log(lineAtNorth);
        lineAtNorthRef.current = [...lineAtNorth];

        const lineAtNorth2 = lines.filter((line) => line.id2 === id && line.y2 < selectedCircle.cy);
        lineAtNorthRef2.current = [...lineAtNorth2]

        // 右
        const lineAtEast = lines.filter((line) => line.id === id && line.x1 > selectedCircle.cx);
        // console.log(lineAtEast);
        lineAtEastRef.current = [...lineAtEast];

        const lineAtEast2 = lines.filter((line) => line.id2 === id && line.x2 > selectedCircle.cx);
        lineAtEastRef2.current = [...lineAtEast2]

        // 下
        const lineAtSouth = lines.filter((line) => line.id === id && line.y1 > selectedCircle.cy);
        // console.log(lineAtSouth);
        lineAtSouthRef.current = [...lineAtSouth];

        const lineAtSouth2 = lines.filter((line) => line.id2 === id && line.y2 > selectedCircle.cy);
        lineAtSouthRef2.current = [...lineAtSouth2];

        // 左
        const lineAtWest = lines.filter((line) => line.id === id && line.x1 < selectedCircle.cx);
        // console.log(lineAtWest);
        lineAtWestRef.current = [...lineAtWest];

        const lineAtWest2 = lines.filter((line) => line.id2 === id && line.x2 < selectedCircle.cx);
        lineAtWestRef2.current = [...lineAtWest2]
    }

    function handleUpdateLine(line, delta){
        line.cpx1 = (line.x1 + line.x2 - delta.dx) / 2;
        line.cpy1 = (line.y1 + line.y2 - delta.dy) / 2;
        line.cpx2 = (line.x1 + line.x2 - delta.dx) / 2;
        line.cpy2 = (line.y1 + line.y2 - delta.dy) / 2;      
    }

    function handleSVGCoordinateTransfer(props){
        const { e, delta } = props
        const CTM = svgRef.current.getScreenCTM().inverse();
        const svgPoint = svgRef.current.createSVGPoint();
        //  1. 滑鼠當前 viewport 中 client 座標值
        svgPoint.x = e.clientX;
        svgPoint.y = e.clientY;

        //  2. 計算對應回去的 SVG 座標值
        const startSVGPoint = svgPoint.matrixTransform(CTM);

        //  3. 計算拖曳後滑鼠所在的 viewport client 座標值
        svgPoint.x = e.clientX + e.movementX;
        svgPoint.y = e.clientY + e.movementY;

        //  4. 計算對應回去的 SVG 座標值
        const moveToSVGPoint = svgPoint.matrixTransform(CTM);
 
        //  5. 計算位移量
        delta.dx = startSVGPoint.x - moveToSVGPoint.x;
        delta.dy = startSVGPoint.y - moveToSVGPoint.y;      
    }
    
    function handleTransformMove(e){
        e.stopPropagation();
        // 節點左半邊
        if (transformIsDragging && leftRightRef.current) {
            // console.log(lineAtNorthRef, lineAtEastRef, lineAtSouthRef, lineAtWestRef,lineAtNorthRef2, lineAtEastRef2, lineAtSouthRef2, lineAtWestRef2)
            // console.log(selectedLines, selectedLines2)
            let delta = {
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            //  6. 設定新的節點大小
            if (selectedCircle.r < 20) {
                    selectedCircle.r = 21;
                } else {
                    selectedCircle.r += delta.dx;
                }
            setCircles([...circles])     
            // 設定該節點的線段同步移動
            // 上
            lineAtNorthRef.current.forEach(line => {
                console.log("N1")
                line.y1 = selectedCircle.cy - selectedCircle.r - delta.dx;
                // 動態曲線點使其為直線
                handleUpdateLine(line, delta);
            })
            lineAtNorthRef2.current.forEach(line => {
                console.log("N1-2")
                line.y2 = selectedCircle.cy - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);
            })    
            // 右
            lineAtEastRef.current.forEach(line => {
                console.log("E1")
                line.x1 = selectedCircle.cx + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);                    
            })
            lineAtEastRef2.current.forEach(line => {
                console.log("E1-2")
                line.x2 = selectedCircle.cx + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);                    
            })
            // 下
            lineAtSouthRef.current.forEach(line => {
                console.log("S1")
                line.y1 = selectedCircle.cy + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);     
            })
            lineAtSouthRef2.current.forEach(line => {
                console.log("S1-2")
                line.y2 = selectedCircle.cy + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);     
            })
            // 左
            lineAtWestRef.current.forEach(line => {
                console.log("W1")
                line.x1 = selectedCircle.cx - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);    
            })
            lineAtWestRef2.current.forEach(line => {
                console.log("W1-2")
                line.x2 = selectedCircle.cx - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);    
            })
            setLines([...lines])

        // 節點右半邊
        } else if (transformIsDragging && !leftRightRef.current) {
            // console.log(lineAtNorthRef, lineAtEastRef, lineAtSouthRef, lineAtWestRef)
            // console.log(selectedLines,selectedLines2)
            let delta = {
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            //  6. 設定新的節點大小
            if (selectedCircle.r < 20) {
                    selectedCircle.r = 21;
                } else {
                    selectedCircle.r -= delta.dx;
                }
            setCircles([...circles])
            // 上
            lineAtNorthRef.current.forEach(line => {
                console.log("N1")
                line.y1 = selectedCircle.cy - selectedCircle.r - delta.dx;
                // 動態曲線點使其為直線
                handleUpdateLine(line, delta);
            })
            lineAtNorthRef2.current.forEach(line => {
                console.log("N1-2")
                line.y2 = selectedCircle.cy - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);
            })    
            // 右
            lineAtEastRef.current.forEach(line => {
                console.log("E1")
                line.x1 = selectedCircle.cx + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);                    
            })
            lineAtEastRef2.current.forEach(line => {
                console.log("E1-2")
                line.x2 = selectedCircle.cx + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);                    
            })
            // 下
            lineAtSouthRef.current.forEach(line => {
                console.log("S1")
                line.y1 = selectedCircle.cy + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);     
            })
            lineAtSouthRef2.current.forEach(line => {
                console.log("S1-2")
                line.y2 = selectedCircle.cy + selectedCircle.r + delta.dx;
                handleUpdateLine(line, delta);     
            })
            // 左
            lineAtWestRef.current.forEach(line => {
                console.log("W1")
                line.x1 = selectedCircle.cx - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);    
            })
            lineAtWestRef2.current.forEach(line => {
                console.log("W1-2")
                line.x2 = selectedCircle.cx - selectedCircle.r - delta.dx;
                handleUpdateLine(line, delta);    
            })            
            setLines([...lines])  
        }
    }

    function handleTransformUp(e){
        e.stopPropagation();
        setTransformIsDragging(false);
    }

    // 將所有點擊動作彙整，待優化
    // function drag(){
    //     if (draggingType = SVG_DRAG_TYPE_CANVAS) {
    //         console.log(draggingType)
    //     }
    // }
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
                viewBox={`${viewBoxOrigin.x} ${viewBoxOrigin.y} ${SVGSize.width} ${SVGSize.height}`}
                xmlns="http://www.w3.org/2000/svg"
                panMode={svgPanMode}
                onWheel={handleWheel}
                onKeyDown={handleRemoveNode}
                onPointerDown={(e) => {
                    handleSvgCanvasMouseDown();
                    resetSvgCanvas();
                }}
                onPointerMove={(e) => {
                    handleSvgCanvasMove(e);
                    handleCircleMouseMove(e);
                    handleTransformMove(e);
                }}
                onPointerUp={(e) =>{
                    handleSvgCanvasMouseUp(e);
                    handleTransformUp(e);
                }}
            >
                {lines.map((line) => (
                    <GroupWrapper key={line.id + uuid()}>
                            <PathSvg
                                tabIndex={-1}
                                d={`M ${line.x1} ${line.y1} C ${line.cpx1} ${line.cpy1}, ${line.cpx2} ${line.cpy2}, ${line.x2} ${line.y2}`}
                                stroke="black"
                                strokeWidth="2"
                                fill="transparent"
                            >
                            </PathSvg>
                    </GroupWrapper>
                ))}
                {circles.map((circle) => (
                    <GroupWrapper key={circle.id}>
                        <CircleSvg
                            ref={circleRef}
                            cx={circle.cx}
                            cy={circle.cy}
                            r={circle.r}
                            id={circle.id}
                            fill={
                                circle.id === selectedCircle.id
                                    ? "#e7e7e7"
                                    : "#ffffff"
                            }
                            onPointerDown={(e) => handleCircleMouseDown(e)}
                        />
                        <ForeignObject
                            // style={{pointerEvents: "none"}} // 讓下方圓形可以被點擊
                            pointerEventMode={foreignObjectPointerEventMode}
                            x={circle.cx - (circle.r) / 2 } 
                            y={circle.cy - (circle.r) / 2 }
                            width={circle.r} 
                            height={circle.r}
                            >
                            <ItemsText>
                                目前無法打字
                            </ItemsText>
                        </ForeignObject>
                    </GroupWrapper>
                ))}
                <ToolGroupWrapper display={ selectedCircle.id !== "default" ? "block" : "none" }>
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx - 24} 
                        y={selectedCircle.cy - (selectedCircle.r + 60)}
                        width={50} 
                        height={50}
                    >
                        <CreateNode 
                            title={"Create New Node Top"}
                            onPointerDown={handleAddNode}
                            // onMouseMove={() => console.log("node")} // 新增浮水印給使用者增加圓形或三角形
                        >
                            <TbArrowBigUpLine size={50}></TbArrowBigUpLine>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx + (selectedCircle.r + 10)} 
                        y={selectedCircle.cy - 25}
                        width={50} 
                        height={50}
                    >
                        <CreateNode 
                            title={"Create New Node Right"}
                            onPointerDown={handleAddNode}
                        >
                            <TbArrowBigRightLine size={50}></TbArrowBigRightLine>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    <ForeignObjectNodeTool                      
                        x={selectedCircle.cx - 24} 
                        y={selectedCircle.cy + (selectedCircle.r) + 10 }
                        width={50} 
                        height={50}
                    >
                        <CreateNode 
                            title={"Create New Node Down"}
                            onPointerDown={handleAddNode}
                        >
                            <TbArrowBigDownLine size={50}></TbArrowBigDownLine>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx - (selectedCircle.r + 60) } 
                        y={selectedCircle.cy - 24}
                        width={50} 
                        height={50}
                    >
                        <CreateNode 
                            title={"Create New Node Left"}
                            onPointerDown={handleAddNode}
                        >
                            <TbArrowBigLeftLine size={50}></TbArrowBigLeftLine>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    {/* 左上控制點 */}
                    <TransformRectNwResize
                        id={selectedCircle.id}
                        className="upperLeft"
                        x={selectedCircle.cx - selectedCircle.r -10}
                        y={selectedCircle.cy - selectedCircle.r -10}
                        height={10}
                        width={10}
                        stroke= "#b471ea"
                        strokeWidth="3"
                        strokeDasharray= "10, 5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill= "#f0f4f7"
                        onPointerDown={handleTransformDown}
                        // onPointerMove={handleTransformMove}
                        onPointerUp={handleTransformUp}
                    />
                    {/* 右上控制點 */}
                    <TransformRectNeResize
                        id={selectedCircle.id}
                        className="upperRight"
                        x={selectedCircle.cx + selectedCircle.r}
                        y={selectedCircle.cy - selectedCircle.r -10}
                        height={10}
                        width={10}
                        stroke= "#b471ea"
                        strokeWidth="3"
                        strokeDasharray= "20, 5, 10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill= "#f0f4f7"
                        onPointerDown={handleTransformDown}
                        // onPointerMove={handleTransformMove}
                        onPointerUp={handleTransformUp}
                    />
                    {/* 右下控制點 */}
                    <TransformRectNwResize
                        id={selectedCircle.id}
                        className="lowerRight"                        
                        x={selectedCircle.cx + selectedCircle.r}
                        y={selectedCircle.cy + selectedCircle.r}
                        height={10}
                        width={10}
                        stroke= "#b471ea"
                        strokeWidth="3"
                        strokeDasharray= "5, 5, 20"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill= "#f0f4f7"
                        onPointerDown={handleTransformDown}
                        // onPointerMove={handleTransformMove}
                        onPointerUp={handleTransformUp}
                    />
                    {/* 左下控制點 */}
                    <TransformRectNeResize
                        id={selectedCircle.id}
                        className="lowerLeft"                        
                        x={selectedCircle.cx - selectedCircle.r -10}
                        y={selectedCircle.cy + selectedCircle.r}
                        height={10}
                        width={10}
                        stroke= "#b471ea"
                        strokeWidth="3"
                        strokeDasharray= "20, 5, 10, 5"
                        strokeDashoffset={20}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill= "#f0f4f7"
                        onPointerDown={handleTransformDown}
                        // onPointerMove={handleTransformMove}
                        onPointerUp={handleTransformUp}
                    />                                                
                </ToolGroupWrapper>
            </Svg>
            <PanMode 
                svgRef={svgRef}
                svgPanMode={svgPanMode} 
                setSvgPanMode={setSvgPanMode}
                svgIsDragging={svgIsDragging}
                setSvgIsDragging={setSvgIsDragging}
                handleSvgCanvasMouseDown={handleSvgCanvasMouseDown}
                handleSvgCanvasMove={handleSvgCanvasMove}
                handleSvgCanvasMouseUp={handleSvgCanvasMouseUp}
            />
            <Zoom 
                SVGSize={SVGSize} 
                setSVGSize={setSVGSize} 
                viewBoxOrigin={viewBoxOrigin} 
                setViewBoxOrigin={setViewBoxOrigin}
            />
        </Main>
    )
}

export default SvgCanvas;

// style-components
const Main = styled.div`
    display: flex;
`;

const Aside = styled.aside`
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #ffbb00;
    /* border: 0.5px solid #000000; */
    box-shadow: 0 0 1px #000000;
    width: 212px;
    /* min-height: calc(100vh - 105px); */
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

const GroupWrapper = styled.g`
`

const ToolGroupWrapper = styled.g`
`

const CircleSvg = styled.circle`
    cursor: move;
`
const PathSvg = styled.path`
    cursor: pointer;
`

const TransformRectNeResize = styled.rect`
    cursor: ne-resize;
`

const TransformRectNwResize = styled.rect`
    cursor: nw-resize;
`

const ForeignObject = styled.foreignObject`
    // 使用props 來改變長寬高，來達成彈性打字
    position: relative;
    pointer-events: ${props => props.pointerEventMode || "none"};

`

const ForeignObjectNodeTool = styled.foreignObject`
`

const ItemsText = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    color: #000000;
`

const CreateNode = styled.button`
    position: absolute;
    height: 50px;
    width: 50px;
    background-color: #ffffff;
    border-radius: 5px;
    z-index: 1;
    cursor: pointer;
    :hover{
        background-color: #cccccc;
    }
`