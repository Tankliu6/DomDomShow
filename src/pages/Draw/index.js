import React, { useRef, useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { v4 as uuid } from "uuid";
import styled from "styled-components";
import PanMode from "./tool/PanMode";
import Zoom, { handleWheel } from "./tool/Zoom";
import Marker from "./svg/Marker";
import Aside from "./tool/Aside";
import Message from "./tool/Message";
import ToolBar from "./tool/ToolBar";
import svgbg from "../../img/svgbg.jpg"
import { handleRemoveNode } from "./tool/Remove";
import { BsNodePlusFill } from "react-icons/bs";
import { 
    TbArrowBigUpLine, 
    TbArrowBigRightLine,
    TbArrowBigDownLine,
    TbArrowBigLeftLine
    } from "react-icons/tb";

function SvgCanvas() {
    const svgRef = useRef(null);
    const svgIsDraggingRef = useRef(false);
    const bezierCurvePointIsDraggingRef = useRef({isDragging: false, point: "default"});
    const nodeTitleRef = useRef("");
    const circleRef = useRef(null);
    const leftRightRef = useRef(null);
    const lineStartAtNorthRef = useRef([]);
    const lineEndAtNorthRef = useRef([]);
    const lineStartAtEastRef = useRef([]);
    const lineEndAtEastRef = useRef([]);
    const lineStartAtSouthRef = useRef([]);
    const lineEndAtSouthRef = useRef([]);
    const lineStartAtWestRef = useRef([]);
    const lineEndAtWestRef = useRef([]);
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState({id: "default", cx: 0, cy: 0, r: 0, title: "", content: ""});
    const [nodeIsDragging, setNodeIsDragging] = useState(false);
    const [viewBoxOrigin, setViewBoxOrigin] = useState({ x: 0, y: 0 })
    const [SVGSize, setSVGSize] = useState({ width: 960, height: 540 }) // viewbox 0 0 "width" "height"
    const [svgIsDragging, setSvgIsDragging] = useState(false);
    const [svgPanMode, setSvgPanMode] = useState({grab: "default", grabbing: "default"});
    const [lines, setLines] = useState([]);
    const [focusingLine, setFocusingLine] = useState({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0});
    const [lineIsDragging, setLineIsDragging] = useState(false);
    const [selectedLines, setSelectedLines] = useState([]);
    const [selectedLines2, setSelectedLines2] = useState([]);
    const [transformIsDragging, setTransformIsDragging] = useState(false);
    const [lineIsOverlapping, setLineIsOverLapping] = useState({startNodeId: false, endNodeId: false});
    const [isTexting, setIsTexting] = useState(false);
    const [useCirclePackage, setUseCirclePackage] = useState(false);
    const [useNodeToolSideBar, setUseNodeToolSideBar] = useState(false);
    const [useCommentBoard, setUseCommentBoard] = useState(false);

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

    function handleSvgCanvasMouseDown(e){
        svgPanMode.grab === "grab" ? svgIsDraggingRef.current = true : null;
    }
    
    function handleSvgCanvasMove(e) {
        e.stopPropagation();
        if (svgIsDraggingRef.current && svgPanMode.grab === "grab") {
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

        setUseCommentBoard(false);

        const targetCircleId = e.target.id; // 立即於此點擊事件中找到被點擊的 id, 因為 state 不會立即改變
        setNodeIsDragging(true);
        console.log(targetCircleId, selectedCircle)

        setUseCirclePackage(false);

        const selected = circles.find((c) => c.id === targetCircleId);
        setSelectedCircle(selected);

        const linesStartBindToSelectedNode = lines.filter((line) => line.startNodeId === targetCircleId);
        setSelectedLines([...linesStartBindToSelectedNode]);

        const linesEndBindToSelectedNode2 = lines.filter((line) => line.endNodeId === targetCircleId);
        setSelectedLines2([...linesEndBindToSelectedNode2])

    }

    function handleCircleMouseMove(e){
        e.stopPropagation();
        // 處理滑鼠變動量的 SVG 座標轉換
        let delta = {
            dx: "",
            dy: ""
        }
        handleSVGCoordinateTransfer({ e, delta });
        //  6. 設定新的節點位置  
        if (selectedCircle.id === "default") return
        // 第一次移動節點動態調整曲線點
        if (nodeIsDragging && selectedCircle.firstMove) {
            console.log("helo")
            // 設定新的 circle 於 SVG 的座標
            selectedCircle.cx -= delta.dx
            selectedCircle.cy -= delta.dy 
            setCircles((prev) => [...prev]);
            // 設定該節點的線段連接點同步移動
            // 由其他節點出發至此被移動節點的線段連接點    
            selectedLines2.forEach(line => {
                line.x2 -= delta.dx;
                line.y2 -= delta.dy;
                line.cpx1 -= delta.dx * 0.4;
                line.cpy1 -= delta.dy * 0.4;
                line.cpx2 -= delta.dx * 0.6;
                line.cpy2 -= delta.dy * 0.6; 
            })
            setLines((prev) => [...prev])
        } else if (nodeIsDragging) {
            console.log("helo222")
            // 設定新的 circle 於 SVG 的座標
            selectedCircle.cx -= delta.dx
            selectedCircle.cy -= delta.dy 
            setCircles((prev) => [...prev]);
            // 設定該節點的線段連接點同步移動
            // 該節點出發的線段連接點
            selectedLines.forEach(line => {
                line.x1 -= delta.dx; 
                line.y1 -= delta.dy;
                line.cpx1 -= delta.dx;
                line.cpy1 -= delta.dy;
                line.cpx2 -= delta.dx;
                line.cpy2 -= delta.dy;
            })
            // 由其他節點出發至此被移動節點的線段連接點    
            selectedLines2.forEach(line => {
                line.x2 -= delta.dx;
                line.y2 -= delta.dy;
                line.cpx1 -= delta.dx;
                line.cpy1 -= delta.dy;
                line.cpx2 -= delta.dx;
                line.cpy2 -= delta.dy;
            })
            setLines((prev) => [...prev])
        }
    }
        
    function handleCircleMouseUp(e) {
        e.stopPropagation();
        console.log("leave");
        selectedCircle.firstMove = false;
        setUseCirclePackage(true);
        setNodeIsDragging(false);
        setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0});
    }

    // 點擊SVG畫布解除選擇節點
    function resetSvgCanvas(e){
        setUseCommentBoard(false);
        setUseCirclePackage(false);
        setIsTexting(false);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0});
        setFocusingLine({ id: "default", x1: 0, y1: 0 , cpx1: 0, cpy1: 0, cpx2: 0, cpy2: 0, x2: 0, y2: 0});
    }

    // 創建新的線段節點
    function handleAddNode(e){
        e.stopPropagation();
        
        function handleAddEndPointCircle(props){
            const {id, x2, y2} = props;
            const newCircle = {
                id: id,
                cx: x2,
                cy: y2,
                r: 20,
                content: "",
                title: "",
                fontSize: "12px",
                fontWeight: "initial",
                fill: "#ffffff",
                stroke: "#ffffff",
                lineStroke: "#443755",
                firstMove: true,
            };
            setCircles(prev => [...prev, newCircle]);
            setSelectedCircle(newCircle);
            setNodeIsDragging(true);
            setUseCirclePackage(false);   
        }

        // 傳進線段末端的節點 id
        const endPointCircleId = uuid();

        const CTM = svgRef.current.getScreenCTM();
        const svgX = (e.clientX - CTM.e) / CTM.a;
        const svgY = (e.clientY - CTM.f) / CTM.d;

        const newLine = {
            id: uuid(),
            // 開始節點 id
            startNodeId: selectedCircle.id,
            // 終點節點 id
            endNodeId: endPointCircleId,
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
        // 消除被上一個節點移動的線段
        setSelectedLines([]);
        setSelectedLines2([newLine]);
        setFocusingLine(newLine);

        if (svgX > selectedCircle.cx + selectedCircle.r) {
            // 右邊
            newLine.x1 = selectedCircle.cx + selectedCircle.r;
            // newLine.y1 = selectedCircle.cy;
            newLine.cpx1 = selectedCircle.cx + selectedCircle.r + 3.5; // 線段 1/4
            newLine.cpx2 = selectedCircle.cx + selectedCircle.r + 10.5;// 線段 3/4
            newLine.x2 = selectedCircle.cx + selectedCircle.r + 14;
            // newLine.y2 = selectedCircle.cy;
            handleAddEndPointCircle({
                id: newLine.endNodeId,
                x2: selectedCircle.cx + selectedCircle.r + 40,
                y2: selectedCircle.cy
            })
        } else if (svgX < selectedCircle.cx - selectedCircle.r) {
            // 左邊
            newLine.x1 = selectedCircle.cx - selectedCircle.r;
            newLine.cpx1 = selectedCircle.cx - selectedCircle.r - 3.5;
            newLine.cpx2 = selectedCircle.cx - selectedCircle.r - 10.5;
            // newLine.y1 = selectedCircle.cy;
            newLine.x2 = selectedCircle.cx - selectedCircle.r - 14;
            // newLine.y2 = selectedCircle.cy;
            handleAddEndPointCircle({
                id: newLine.endNodeId,
                x2: selectedCircle.cx - selectedCircle.r - 40,
                y2: selectedCircle.cy
            }) 
        } else if (svgY > selectedCircle.cy + selectedCircle.r) {
            // 下
            // newLine.x1 = selectedCircle.cx;
            newLine.y1 = selectedCircle.cy + selectedCircle.r;
            newLine.cpy1 = selectedCircle.cy + selectedCircle.r + 3.5;
            newLine.cpy2 = selectedCircle.cy + selectedCircle.r + 10.5;
            // newLine.x2 = selectedCircle.cx;
            newLine.y2 = selectedCircle.cy + selectedCircle.r + 14;
            handleAddEndPointCircle({
                id: newLine.endNodeId,
                x2: selectedCircle.cx,
                y2: selectedCircle.cy + selectedCircle.r + 40
            }) 
        } else if (svgY < selectedCircle.cy - selectedCircle.r) {
            // 上
            // newLine.x1 = selectedCircle.cx;
            newLine.y1 = selectedCircle.cy - selectedCircle.r;
            newLine.cpy1 = selectedCircle.cy - selectedCircle.r - 3.5;
            newLine.cpy2 = selectedCircle.cy - selectedCircle.r - 10.5;
            // newLine.x2 = selectedCircle.cx;
            newLine.y2 = selectedCircle.cy - selectedCircle.r - 14;
            handleAddEndPointCircle({
                id: newLine.endNodeId,
                x2: selectedCircle.cx,
                y2: selectedCircle.cy - selectedCircle.r - 40
            }) 
        }
        setLines((prev) => [...prev, newLine])
    }

    function handleTransformDown(e){
        e.stopPropagation();
        setTransformIsDragging(true);
        const CircleId = selectedCircle.id;
        // left = true
        if (e.target.classList.contains("upperLeft") || e.target.classList.contains("lowerLeft")) {
            leftRightRef.current = true;
        } else {
            leftRightRef.current = false;
        }

        // 圓形右下判斷點
        const atCircleLowerRight = {x: selectedCircle.cx + selectedCircle.r * Math.cos(45 * (Math.PI/180)), y: selectedCircle.cy + selectedCircle.r * Math.sin(45 * (Math.PI/180))};
        // 圓形左下判斷點
        const atCircleLowerLeft = {x: selectedCircle.cx + selectedCircle.r * Math.cos(135 * (Math.PI/180)), y: selectedCircle.cy + selectedCircle.r * Math.sin(135 * (Math.PI/180))};
        // 圓形左上判斷點
        const atCircleUpperLeft = {x: selectedCircle.cx + selectedCircle.r * Math.cos(225 * (Math.PI/180)), y: selectedCircle.cy + selectedCircle.r * Math.sin(225 * (Math.PI/180))};
        // 圓形右上判斷點
        const atCircleUpperRight = {x: selectedCircle.cx + selectedCircle.r * Math.cos(315 * (Math.PI/180)), y: selectedCircle.cy + selectedCircle.r * Math.sin(315 * (Math.PI/180))};

        // 上
        const lineStartAtNorth = lines.filter((line) => line.startNodeId === CircleId && line.y1 <= atCircleUpperLeft.y && line.x1 >= atCircleUpperLeft.x && line.x1 <= atCircleUpperRight.x);
        lineStartAtNorthRef.current = [...lineStartAtNorth];

        const lineEndAtNorth = lines.filter((line) => line.endNodeId === CircleId && line.y2 <= atCircleUpperLeft.y && line.x2 >= atCircleUpperLeft.x && line.x2 <= atCircleUpperRight.x);
        lineEndAtNorthRef.current = [...lineEndAtNorth]

        // 右
        const lineStartAtEast = lines.filter((line) => line.startNodeId === CircleId && line.x1 >= atCircleUpperRight.x && line.y1 >= atCircleUpperRight.y && line.y1 <= atCircleLowerRight.y);
        lineStartAtEastRef.current = [...lineStartAtEast];

        const lineEndAtEast = lines.filter((line) => line.endNodeId === CircleId && line.x2 >= atCircleUpperRight.x && line.y2 >= atCircleUpperRight.y && line.y2 <= atCircleLowerRight.y);
        lineEndAtEastRef.current = [...lineEndAtEast]

        // 下
        const lineStartAtSouth = lines.filter((line) => line.startNodeId === CircleId && line.y1 >= atCircleLowerLeft.y && line.x1 >= atCircleLowerLeft.x && line.x1 <= atCircleLowerRight.x);
        lineStartAtSouthRef.current = [...lineStartAtSouth];

        const lineEndAtSouth = lines.filter((line) => line.endNodeId === CircleId && line.y2 >= atCircleLowerLeft.y && line.x2 >= atCircleLowerLeft.x && line.x2 <= atCircleLowerRight.x);
        lineEndAtSouthRef.current = [...lineEndAtSouth];

        // 左
        const lineStartAtWest = lines.filter((line) => line.startNodeId === CircleId && line.x1 <= atCircleUpperLeft.x && line.y1 >= atCircleUpperLeft.y && line.y1 <= atCircleLowerLeft.y);
        lineStartAtWestRef.current = [...lineStartAtWest];

        const lineEndAtWest = lines.filter((line) => line.endNodeId === CircleId && line.x2 <= atCircleLowerLeft.x && line.y2 >= atCircleUpperLeft.y && line.y2 <= atCircleLowerLeft.y);
        lineEndAtWestRef.current = [...lineEndAtWest]
    }

    function handleNodeLineStraight(line, delta){
        line.cpx1 = (line.x1 + line.x2 - delta.dx) / 2;
        line.cpy1 = (line.y1 + line.y2 - delta.dy) / 2;
        line.cpx2 = (line.x1 + line.x2 - delta.dx) / 2;
        line.cpy2 = (line.y1 + line.y2 - delta.dy) / 2;      
    }
  
    function handleTransformMove(e){
        e.stopPropagation();
        // 節點左半邊
        if (transformIsDragging && leftRightRef.current) {
            console.log(lineStartAtNorthRef, lineStartAtEastRef, lineStartAtSouthRef, lineStartAtWestRef,lineEndAtNorthRef, lineEndAtEastRef, lineEndAtSouthRef, lineEndAtWestRef)
            // console.log(selectedLines, selectedLines2)
            let delta = {
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            //  6. 設定新的節點大小
            if (selectedCircle.r < 19) {
                    selectedCircle.r = 20;
                } else {
                    selectedCircle.r += delta.dx;
                }
            setCircles((prev) => [...prev])     
            // 設定該節點的線段同步移動
            // 上
            lineStartAtNorthRef.current.forEach(line => {
                console.log("N1")
                line.y1 = selectedCircle.cy - selectedCircle.r - delta.dx;
            })
            lineEndAtNorthRef.current.forEach(line => {
                console.log("N1-2")
                line.y2 = selectedCircle.cy - selectedCircle.r - delta.dx;
            })    
            // 右
            lineStartAtEastRef.current.forEach(line => {
                console.log("E1")
                line.x1 = selectedCircle.cx + selectedCircle.r + delta.dx;                   
            })
            lineEndAtEastRef.current.forEach(line => {
                console.log("E1-2")
                line.x2 = selectedCircle.cx + selectedCircle.r + delta.dx;                   
            })
            // 下
            lineStartAtSouthRef.current.forEach(line => {
                console.log("S1")
                line.y1 = selectedCircle.cy + selectedCircle.r + delta.dx;    
            })
            lineEndAtSouthRef.current.forEach(line => {
                console.log("S1-2")
                line.y2 = selectedCircle.cy + selectedCircle.r + delta.dx;  
            })
            // 左
            lineStartAtWestRef.current.forEach(line => {
                console.log("W1")
                line.x1 = selectedCircle.cx - selectedCircle.r - delta.dx;  
            })
            lineEndAtWestRef.current.forEach(line => {
                console.log("W1-2")
                line.x2 = selectedCircle.cx - selectedCircle.r - delta.dx;   
            })
            setLines((prev) => [...prev])

        // 節點右半邊
        } else if (transformIsDragging && !leftRightRef.current) {
            let delta = {
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            //  6. 設定新的節點大小
            if (selectedCircle.r < 19) {
                    selectedCircle.r = 20;
                } else {
                    selectedCircle.r -= delta.dx;
                }
            setCircles((prev) => [...prev])
            // 上
            lineStartAtNorthRef.current.forEach(line => {
                console.log("N1")
                line.y1 = selectedCircle.cy - selectedCircle.r - delta.dx;
            })
            lineEndAtNorthRef.current.forEach(line => {
                console.log("N1-2")
                line.y2 = selectedCircle.cy - selectedCircle.r - delta.dx;
            })    
            // 右
            lineStartAtEastRef.current.forEach(line => {
                console.log("E1")
                line.x1 = selectedCircle.cx + selectedCircle.r + delta.dx;                 
            })
            lineEndAtEastRef.current.forEach(line => {
                console.log("E1-2")
                line.x2 = selectedCircle.cx + selectedCircle.r + delta.dx;                 
            })
            // 下
            lineStartAtSouthRef.current.forEach(line => {
                console.log("S1")
                line.y1 = selectedCircle.cy + selectedCircle.r + delta.dx;    
            })
            lineEndAtSouthRef.current.forEach(line => {
                console.log("S1-2")
                line.y2 = selectedCircle.cy + selectedCircle.r + delta.dx;    
            })
            // 左
            lineStartAtWestRef.current.forEach(line => {
                console.log("W1")
                line.x1 = selectedCircle.cx - selectedCircle.r - delta.dx;   
            })
            lineEndAtWestRef.current.forEach(line => {
                console.log("W1-2")
                line.x2 = selectedCircle.cx - selectedCircle.r - delta.dx;  
            })            
            setLines((prev) => [...prev])  
        }
    }

    function handleTransformUp(e){
        e.stopPropagation();
        setTransformIsDragging(false);
    }

    function handleLineDown(e){
        e.stopPropagation();
        const targetLineId = e.target.id;
        const focusingLine = lines.find(line => line.id === targetLineId);
        setUseCommentBoard(false);
        setFocusingLine(focusingLine);
        setLineIsDragging(true);
        setUseCirclePackage(false);
        setSelectedCircle({id: "default", cx: 0, cy: 0, r: 0}); // 關閉圓形節點的工具組
        console.log(focusingLine)
    }

    function handleLineMove(e){
        e.stopPropagation();
        if (!lineIsDragging) {
            return
        } else if (lineIsDragging) {
            let delta = {
                x: "",
                y: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            focusingLine.x1 -= delta.dx;
            focusingLine.y1 -= delta.dy;
            focusingLine.x2 -= delta.dx;
            focusingLine.y2 -= delta.dy;
            focusingLine.cpx1 -= delta.dx;
            focusingLine.cpy1 -= delta.dy;
            focusingLine.cpx2 -= delta.dx;
            focusingLine.cpy2 -= delta.dy;

            let startNodeId = ""; // 解決 hook 非同步更新使得後執行的 foundEndCircle 蓋掉先執行 foundStartCircle 賦予的 startNodeId 值
            const foundStartCircle = circles.some((circle) => {
                const lineToCircleBoundaryDistance = (( focusingLine.x1 - circle.cx )** 2 + ( focusingLine.y1 - circle.cy )** 2 ) ** (1/2);
                if (lineToCircleBoundaryDistance < circle.r) {
                    focusingLine.startNodeId = circle.id;
                    setLineIsOverLapping({startNodeId: circle.id, endNodeId: lineIsOverlapping.endNodeId})
                    startNodeId = circle.id;      
                    return true;
                } else {
                    focusingLine.startNodeId = "";
                    setLineIsOverLapping({startNodeId: false, endNodeId: lineIsOverlapping.endNodeId});
                    startNodeId = false;
                    return false;
                }
            });
        
            if (!foundStartCircle) {
                focusingLine.startNodeId = "";
            }
            
            const foundEndCircle = circles.some((circle) => {
                const lineToCircleBoundaryDistance = (( focusingLine.x2 - circle.cx )** 2 + ( focusingLine.y2 - circle.cy )** 2 ) ** (1/2);
                if (lineToCircleBoundaryDistance < circle.r) {
                    focusingLine.endNodeId = circle.id;
                    setLineIsOverLapping({startNodeId: startNodeId, endNodeId: circle.id})               
                    return true;
                } else {
                    focusingLine.endNodeId = "";
                    setLineIsOverLapping({startNodeId: startNodeId, endNodeId: false});
                    return false;
                }
            });
        
            if (!foundEndCircle) {
                focusingLine.endNodeId = "";
            }

            setLines((prev) => [...prev]);
        }
    }

    function handleLineUp(e){
        e.stopPropagation();
        const newStartNode = circles.find(circle => circle.id === lineIsOverlapping.startNodeId);
        if (newStartNode) {
            const distances = [
                {position: "top", distance: ((focusingLine.x1 - newStartNode.cx)**2 + (focusingLine.y1- (newStartNode.cy - newStartNode.r))**2) ** (1/2)},
                {position: "right", distance: ((focusingLine.x1 - (newStartNode.cx + newStartNode.r))**2 + (focusingLine.y1- newStartNode.cy)**2) ** (1/2)},
                {position: "bottom", distance: ((focusingLine.x1 - newStartNode.cx)**2 + (focusingLine.y1- (newStartNode.cy + newStartNode.r))**2) ** (1/2)},
                {position: "left", distance: ((focusingLine.x1 - (newStartNode.cx - newStartNode.r))**2 + (focusingLine.y1- newStartNode.cy)**2) ** (1/2)}
            ]
            const minDistancePosition = distances.reduce((prev, curr) => {
                return (prev.distance < curr.distance) ? prev : curr;
            });
    
            if (minDistancePosition.position === "top") {
                focusingLine.x1 = newStartNode.cx;
                focusingLine.y1 = newStartNode.cy - newStartNode.r;
            } else if (minDistancePosition.position === "right") {
                focusingLine.x1 = newStartNode.cx + newStartNode.r;
                focusingLine.y1 = newStartNode.cy;
            } else if (minDistancePosition.position === "bottom") {
                focusingLine.x1 = newStartNode.cx;
                focusingLine.y1 = newStartNode.cy + newStartNode.r;
            } else if (minDistancePosition.position === "left") {
                focusingLine.x1 = newStartNode.cx - newStartNode.r;
                focusingLine.y1 = newStartNode.cy;
            }     
        }
        const newEndNode = circles.find(circle => circle.id === lineIsOverlapping.endNodeId);
        if (newEndNode) {
            const distances = [
                {position: "top", distance: ((focusingLine.x2 - newEndNode.cx)**2 + (focusingLine.y2- (newEndNode.cy - newEndNode.r))**2) ** (1/2)},
                {position: "right", distance: ((focusingLine.x2 - (newEndNode.cx + newEndNode.r))**2 + (focusingLine.y2- newEndNode.cy)**2) ** (1/2)},
                {position: "bottom", distance: ((focusingLine.x2 - newEndNode.cx)**2 + (focusingLine.y2- (newEndNode.cy + newEndNode.r))**2) ** (1/2)},
                {position: "left", distance: ((focusingLine.x2 - (newEndNode.cx - newEndNode.r))**2 + (focusingLine.y2- newEndNode.cy)**2) ** (1/2)}
            ]
            const minDistancePosition = distances.reduce((prev, curr) => {
                return (prev.distance < curr.distance) ? prev : curr;
            });
    
            if (minDistancePosition.position === "top") {
                focusingLine.x2 = newEndNode.cx;
                focusingLine.y2 = newEndNode.cy - newEndNode.r;
            } else if (minDistancePosition.position === "right") {
                focusingLine.x2 = newEndNode.cx + newEndNode.r;
                focusingLine.y2 = newEndNode.cy;
            } else if (minDistancePosition.position === "bottom") {
                focusingLine.x2 = newEndNode.cx;
                focusingLine.y2 = newEndNode.cy + newEndNode.r;
            } else if (minDistancePosition.position === "left") {
                focusingLine.x2 = newEndNode.cx - newEndNode.r;
                focusingLine.y2 = newEndNode.cy;
            }          
    
        }
        setLineIsDragging(false);
        setLineIsOverLapping({startNodeId: false, endNodeId: false});
        setNodeIsDragging(false);
    }

    function handleLineBezierCurveDown(e){
        e.stopPropagation();
        console.log(focusingLine)
        bezierCurvePointIsDraggingRef.current = { isDragging: true, point: e.target.id };
        setUseCirclePackage(false);
    }

    function handleLineBezierCurveMove(e){
        e.stopPropagation();
        if (bezierCurvePointIsDraggingRef.current.isDragging && bezierCurvePointIsDraggingRef.current.point === "BezierP1"){
            let delta={
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            focusingLine.cpx1 -= delta.dx;
            focusingLine.cpy1 -= delta.dy;
            setLines((prev) => [...prev]);   
        } else if (bezierCurvePointIsDraggingRef.current.isDragging && bezierCurvePointIsDraggingRef.current.point === "BezierP2") {
            let delta={
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            focusingLine.cpx2 -= delta.dx;
            focusingLine.cpy2 -= delta.dy;
            setLines((prev) => [...prev]);
        } else if (bezierCurvePointIsDraggingRef.current.isDragging && bezierCurvePointIsDraggingRef.current.point === "startNode"){
            let delta={
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            focusingLine.x1 -= delta.dx;
            focusingLine.y1 -= delta.dy;
            focusingLine.cpx1 -= delta.dx;
            focusingLine.cpy1 -= delta.dy;
            focusingLine.cpx2 -= delta.dx;
            focusingLine.cpy2 -= delta.dy;
            handleLineChangeNode(true); // true 更改 startNodeId
            setLines((prev) => [...prev]);   
        } else if (bezierCurvePointIsDraggingRef.current.isDragging && bezierCurvePointIsDraggingRef.current.point === "endNode") {
            let delta={
                dx: "",
                dy: ""
            }
            handleSVGCoordinateTransfer({e, delta});
            focusingLine.x2 -= delta.dx;
            focusingLine.y2 -= delta.dy;
            focusingLine.cpx1 -= delta.dx;
            focusingLine.cpy1 -= delta.dy;
            focusingLine.cpx2 -= delta.dx;
            focusingLine.cpy2 -= delta.dy;
            handleLineChangeNode(false); // false 更改 endNodeId
            setLines((prev) => [...prev]);
        }
    }

    function handleLineBezierCurveUp(){
        bezierCurvePointIsDraggingRef.current = false;
        setLineIsOverLapping({startNodeId: false, endNodeId: false});
    }

    function handleLineChangeNode(isStartNode) {
        let lineX;
        let lineY;
        let nodeId;
    
        if (isStartNode) {
            lineX = focusingLine.x1;
            lineY = focusingLine.y1;
            nodeId = "startNodeId";
        } else {
            lineX = focusingLine.x2;
            lineY = focusingLine.y2;
            nodeId = "endNodeId";
        }
    
        const foundCircle = circles.some((circle) => {
            const lineToCircleBoundaryDistance = (( lineX - circle.cx )** 2 + ( lineY - circle.cy )** 2 ) ** (1/2);
            if (lineToCircleBoundaryDistance < circle.r) {
                console.table(`change ${nodeId}`, circle.id);
                focusingLine[nodeId] = circle.id;
                if (isStartNode) {
                    setLineIsOverLapping({startNodeId: circle.id, endNodeId: lineIsOverlapping.endNodeId})       
                } else {
                    setLineIsOverLapping({startNodeId: lineIsOverlapping.startNodeId, endNodeId: circle.id})       
                }
                return true;
            } else {
                focusingLine[nodeId] = "";
                setLineIsOverLapping(false);
                return false;
            }
        });
    
        if (!foundCircle) {
            focusingLine[nodeId] = "";
        }
    }
    
    function handleLineChangeNodeUp(e){
        const isStartNode = e.target.id;
        let lineX;
        let lineY;
        let selectedCircle;

        if (isStartNode === "startNode") {
            lineX = focusingLine.x1;
            lineY = focusingLine.y1;
            selectedCircle = circles.find(circle => 
                circle.id === focusingLine.startNodeId
            );
        } else {
            // isEndNode
            lineX = focusingLine.x2;
            lineY = focusingLine.y2;
            selectedCircle = circles.find(circle => 
                circle.id === focusingLine.endNodeId
            );
        };

        if (!selectedCircle) {
            return
        };

        const distances = [
            {position: "top", distance: ((lineX - selectedCircle.cx)**2 + (lineY- (selectedCircle.cy - selectedCircle.r))**2) ** (1/2)},
            {position: "right", distance: ((lineX - (selectedCircle.cx + selectedCircle.r))**2 + (lineY- selectedCircle.cy)**2) ** (1/2)},
            {position: "bottom", distance: ((lineX - selectedCircle.cx)**2 + (lineY- (selectedCircle.cy + selectedCircle.r))**2) ** (1/2)},
            {position: "left", distance: ((lineX - (selectedCircle.cx - selectedCircle.r))**2 + (lineY- selectedCircle.cy)**2) ** (1/2)}
        ]

        const minDistancePosition = distances.reduce((prev, curr) => {
            return (prev.distance < curr.distance) ? prev : curr;
        });

        if (isStartNode === "startNode" && minDistancePosition.position === "top") {
            focusingLine.x1 = selectedCircle.cx;
            focusingLine.y1 = selectedCircle.cy - selectedCircle.r;
        } else if (isStartNode === "startNode" && minDistancePosition.position === "right") {
            focusingLine.x1 = selectedCircle.cx + selectedCircle.r;
            focusingLine.y1 = selectedCircle.cy;
        } else if (isStartNode === "startNode" && minDistancePosition.position === "bottom") {
            focusingLine.x1 = selectedCircle.cx;
            focusingLine.y1 = selectedCircle.cy + selectedCircle.r;
        } else if (isStartNode === "startNode" && minDistancePosition.position === "left") {
            focusingLine.x1 = selectedCircle.cx - selectedCircle.r;
            focusingLine.y1 = selectedCircle.cy;
        } else if (isStartNode !== "startNode" && minDistancePosition.position === "top") {
            focusingLine.x2 = selectedCircle.cx;
            focusingLine.y2 = selectedCircle.cy - selectedCircle.r;
        } else if (isStartNode !== "startNode" && minDistancePosition.position === "right") {
            focusingLine.x2 = selectedCircle.cx + selectedCircle.r;
            focusingLine.y2 = selectedCircle.cy;
        } else if (isStartNode !== "startNode" && minDistancePosition.position === "bottom") {
            focusingLine.x2 = selectedCircle.cx;
            focusingLine.y2 = selectedCircle.cy + selectedCircle.r;
        } else if (isStartNode !== "startNode" && minDistancePosition.position === "left") {
            focusingLine.x2 = selectedCircle.cx - selectedCircle.r;
            focusingLine.y2 = selectedCircle.cy;
        }
    }

    function handleNodeContent(e){
        nodeTitleRef.current = e.target.value;
        console.log(nodeTitleRef, e.currentTarget.id)
        const nodeContentId = e.currentTarget.id.split("nodeContent-")[1];
        const selectedCircle = circles.find(circle => circle.id === nodeContentId);
        selectedCircle.title = e.target.value;
        setCircles((prev) => [...prev]);
    }

    return (
        <Main>           
            <Aside
                svgRef={svgRef} 
                viewBoxOrigin={viewBoxOrigin}
                SVGSize={SVGSize}
                circles={circles}
                setCircles={setCircles}               
                lines={lines}
                setLines={setLines}
                selectedCircle={selectedCircle}
                setSelectedCircle={setSelectedCircle}
                focusingLine={focusingLine}
                setFocusingLine={setFocusingLine}
                setUseCirclePackage={setUseCirclePackage}
                setNodeIsDragging={setNodeIsDragging}
                setSelectedLines={setSelectedLines}
                setSelectedLines2={setSelectedLines2}
                setLineIsDragging={setLineIsDragging}
            />
            <Svg
                tabIndex={-1}
                id="svg"
                ref={svgRef}
                viewBox={`${viewBoxOrigin.x} ${viewBoxOrigin.y} ${SVGSize.width} ${SVGSize.height}`}
                xmlns="http://www.w3.org/2000/svg"
                panMode={svgPanMode}
                onWheel={(e) => { 
                    handleWheel(e, svgRef, viewBoxOrigin, SVGSize, setSVGSize, setViewBoxOrigin)
                }}
                onKeyDown={(e) => {
                    handleRemoveNode(
                        e, 
                        { 
                            selectedCircle, 
                            setSelectedCircle, 
                            circles, 
                            setCircles, 
                            lines, 
                            setLines, 
                            focusingLine, 
                            setFocusingLine, 
                            setUseCirclePackage 
                        }
                    );
                }}
                onPointerDown={(e) => {
                    handleSvgCanvasMouseDown();
                    resetSvgCanvas();
                    console.log("reset")
                }}
                onPointerMove={(e) => {
                    handleSvgCanvasMove(e);
                    handleCircleMouseMove(e);
                    handleTransformMove(e);
                    handleLineBezierCurveMove(e);
                    handleLineMove(e);
                }}
                onPointerUp={(e) =>{
                    handleSvgCanvasMouseUp(e);
                    handleTransformUp(e);
                    handleLineBezierCurveUp();
                    handleLineUp(e);
                }}
            >                 
                {lines.map((line, index) => 
                    <GroupWrapper key={index}>                       
                        <PathSvg
                            id={line.id}
                            d={`M ${line.x1} ${line.y1} C ${line.cpx1} ${line.cpy1}, ${line.cpx2} ${line.cpy2}, ${line.x2} ${line.y2}`}
                            stroke={circles.find(circle => {if (circle.id === line.startNodeId) {return circle.lineStroke}})?.lineStroke ?? "#443755"}
                            strokeWidth="4"
                            fill="none"
                            onPointerDown={handleLineDown}
                            onPointerUp={(e) => {
                                handleLineUp(e);
                                handleTransformUp(e);
                            }}
                            markerStart={`url(#startNodeCircle)`}
                            markerEnd={`url(#endNodeArrow)`}
                            cursor={focusingLine.id === line.id ? "move" : "pointer"}
                        >
                        </PathSvg>
                    </GroupWrapper>
                )}
                {circles.map((circle, index) => 
                    <GroupWrapper key={index}>
                        <CircleSvg
                            ref={circleRef}
                            cx={circle.cx}
                            cy={circle.cy}
                            r={circle.r}
                            id={circle.id}
                            fill={circle.fill}
                            stroke={
                                circle.id === lineIsOverlapping.startNodeId || circle.id === lineIsOverlapping.endNodeId
                                    ? "#b471ea"
                                    : circle.stroke
                            }
                            strokeWidth={
                                2
                            }
                            cursor={
                                selectedCircle.id === circle.id ? "move" : "auto"
                            }
                            onPointerDown={(e) => handleCircleMouseDown(e)}
                            onPointerUp={(e) => {
                                handleCircleMouseUp(e);
                                handleTransformUp(e);
                                handleLineUp(e);
                            }}
                            onDoubleClick={() =>{ 
                                setIsTexting(true);
                                setUseCirclePackage(false);
                            }}
                        />
                        <circle 
                            display={ circle.id === lineIsOverlapping.startNodeId || circle.id === lineIsOverlapping.endNodeId
                                    ? "block"
                                    : "none"
                                } 
                            cx={circle.cx} 
                            cy={circle.cy - circle.r} 
                            r={5} 
                            fill="#ffffff" 
                            stroke="#000000">
                        </circle>
                        <circle 
                            display={ circle.id === lineIsOverlapping.startNodeId || circle.id === lineIsOverlapping.endNodeId
                                    ? "block"
                                    : "none"
                                } 
                            cx={circle.cx + circle.r} 
                            cy={circle.cy} 
                            r={5} 
                            fill="#ffffff" 
                            stroke="#000000">
                        </circle>
                        <circle 
                            display={ circle.id === lineIsOverlapping.startNodeId || circle.id === lineIsOverlapping.endNodeId
                                    ? "block"
                                    : "none"
                                } 
                            cx={circle.cx} 
                            cy={circle.cy + circle.r} 
                            r={5} 
                            fill="#ffffff" 
                            stroke="#000000">
                        </circle>
                        <circle 
                            display={ circle.id === lineIsOverlapping.startNodeId || circle.id === lineIsOverlapping.endNodeId
                                    ? "block"
                                    : "none"
                                } 
                            cx={circle.cx - circle.r} 
                            cy={circle.cy} 
                            r={5} 
                            fill="#ffffff" 
                            stroke="#000000">
                        </circle>                                                                        
                        <ForeignObject
                            x={ circle.cx + circle.r * Math.cos(225 * (Math.PI/180)) } 
                            y={ circle.cy + circle.r * Math.cos(225 * (Math.PI/180)) }
                            width={ Math.abs(circle.cx + circle.r * Math.cos(315 * (Math.PI/180)) - (circle.cx + circle.r * Math.cos(225 * (Math.PI/180)))) } 
                            height={ Math.abs(circle.cy + circle.r * Math.cos(135 * (Math.PI/180)) - circle.cy + circle.r * Math.cos(225 * (Math.PI/180))) }
                            pointerEventMode={
                                isTexting ? "auto" : "none"
                            }
                            onPointerDown={(e) => {
                                e.stopPropagation();
                                const nodeId = e.target.id.split("nodeContent-")[1];
                                const selected = circles.find((c) => c.id === nodeId);
                                setSelectedCircle(selected);
                                setNodeIsDragging(false);
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                setIsTexting(false);
                            }}                       
                            >
                            <WrapperNodeContent
                                id={"nodeContent-" + circle.id}
                            >    
                                <NodeContent
                                    id={"nodeContent-" + circle.id}
                                    html={circle.title ?? ""}
                                    onChange={handleNodeContent}
                                    placeholder= {isTexting ? "Title" : ""}
                                    istexting={isTexting.toString()}
                                    fontSize={circle.fontSize}
                                    fontWeight={circle.fontWeight}
                                />
                            </WrapperNodeContent>
                        </ForeignObject>
                    </GroupWrapper>
                )}
                <GroupWrapper display={ useCirclePackage && selectedCircle.id !== "default" || isTexting && selectedCircle.id !== "default" ? "block" : "none" }>
                { !useNodeToolSideBar ? 
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx - 140} 
                        y={selectedCircle.cy - (selectedCircle.r + 220)}
                        width={280} 
                        height={220}
                    >
                        <ToolBar 
                            selectedCircle={selectedCircle}
                            circles={circles}
                            setCircles={setCircles}
                            useNodeToolSideBar={useNodeToolSideBar}
                            setUseNodeToolSideBar={setUseNodeToolSideBar}
                            isTexting={isTexting}
                            setIsTexting={setIsTexting}
                            useCommentBoard={useCommentBoard}
                            setUseCommentBoard={setUseCommentBoard}
                            useCirclePackage={useCirclePackage}
                            setUseCirclePackage={setUseCirclePackage}
                        />
                    </ForeignObjectNodeTool>
                    :
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx - 10} 
                        y={selectedCircle.cy - (selectedCircle.r + 35)}
                        width={20} 
                        height={20}
                    >
                        <CreateNode
                            className="top" 
                            title={"Drag and Drop to add newNode"}
                            onPointerDown={handleAddNode}
                        >
                            <BsNodePlusFill size={20}></BsNodePlusFill>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                }
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx + (selectedCircle.r + 15)} 
                        y={selectedCircle.cy - 10}
                        width={20} 
                        height={20}
                    >
                        <CreateNode 
                            className="right"
                            title={"Drag and Drop to add newNode"}
                            onPointerDown={handleAddNode}
                        >
                            <BsNodePlusFill size={20}></BsNodePlusFill>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    <ForeignObjectNodeTool                      
                        x={selectedCircle.cx - 10} 
                        y={selectedCircle.cy + (selectedCircle.r) + 15 }
                        width={20} 
                        height={20}
                    >
                        <CreateNode
                            className="bottom" 
                            title={"Drag and Drop to add newNode"}
                            onPointerDown={handleAddNode}
                        >
                            <BsNodePlusFill size={20}></BsNodePlusFill>
                        </CreateNode>
                    </ForeignObjectNodeTool>
                    <ForeignObjectNodeTool
                        x={selectedCircle.cx - (selectedCircle.r + 35) } 
                        y={selectedCircle.cy - 10}
                        width={20} 
                        height={20}
                    >
                        <CreateNode
                            className="left" 
                            title={"Drag and Drop to add newNode"}
                            onPointerDown={handleAddNode}
                        >
                            <BsNodePlusFill size={20}></BsNodePlusFill>
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
                        fill= "transparent"
                        onPointerDown={handleTransformDown}
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
                        fill= "transparent"
                        onPointerDown={handleTransformDown}
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
                        fill= "transparent"
                        onPointerDown={handleTransformDown}
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
                        fill= "transparent"
                        onPointerDown={handleTransformDown}
                    />                                                
                </GroupWrapper>
                <GroupWrapper display={ focusingLine.id !== "default" ? "block" : "none" }>
                    <Line x1={focusingLine.x1} y1={focusingLine.y1} x2={focusingLine.cpx1} y2={focusingLine.cpy1} onPointerUp={handleLineUp}></Line>
                    <Line x1={focusingLine.x2} y1={focusingLine.y2} x2={focusingLine.cpx2} y2={focusingLine.cpy2} onPointerUp={handleLineUp}></Line>
                    <CircleToSetLine
                        id={"startNode"} 
                        cx={focusingLine.x1} 
                        cy={focusingLine.y1}
                        onPointerDown={(e) => handleLineBezierCurveDown(e)}
                        onPointerUp={handleLineChangeNodeUp} 
                    />
                    <CircleToBezier 
                        id={"BezierP1"} 
                        cx={focusingLine.cpx1} 
                        cy={focusingLine.cpy1} 
                        onPointerDown={(e) => handleLineBezierCurveDown(e)}
                    />
                    <CircleToBezier
                        id={"BezierP2"} 
                        cx={focusingLine.cpx2} 
                        cy={focusingLine.cpy2} 
                        onPointerDown={(e) => handleLineBezierCurveDown(e)}
                    />
                    <CircleToSetLine
                        id={"endNode"} 
                        cx={focusingLine.x2} 
                        cy={focusingLine.y2}
                        onPointerDown={(e) => handleLineBezierCurveDown(e)}
                        onPointerUp={handleLineChangeNodeUp}
                    />
                </GroupWrapper>
                {useCommentBoard ?
                    <foreignObject
                        x={selectedCircle.cx + selectedCircle.r + 20}
                        y={selectedCircle.cy - 57.5}
                        width={250}
                        height={150}
                    >
                        <Message 
                                selectedCircle={selectedCircle}
                                circles={circles}
                                setCircles={setCircles}
                            />
                    </foreignObject>
                    : ""
                }    
                <Marker />
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
                svgRef={svgRef} 
                SVGSize={SVGSize} 
                setSVGSize={setSVGSize} 
                viewBoxOrigin={viewBoxOrigin} 
                setViewBoxOrigin={setViewBoxOrigin}
            />
            {useNodeToolSideBar ?             
                <ToolBar 
                    selectedCircle={selectedCircle}
                    circles={circles}
                    setCircles={setCircles}
                    useNodeToolSideBar={useNodeToolSideBar}
                    setUseNodeToolSideBar={setUseNodeToolSideBar}
                    isTexting={isTexting}
                    setIsTexting={setIsTexting}
                    useCommentBoard={useCommentBoard}
                    setUseCommentBoard={setUseCommentBoard}
                    useCirclePackage={useCirclePackage}
                    setUseCirclePackage={setUseCirclePackage}
                />
                : "" }
        </Main>
    )
}

export default SvgCanvas;

// style-components
const Main = styled.div`
    display: flex;
`;

const Svg = styled.svg`
    cursor: ${props => props.panMode.grab};
    border: 1px solid #cccccc;
    background-color: var(--color-SVG-background-gray);
    height: calc(100vh - 105px);
    width: 100%;
    outline: none;
    background-image: url(${svgbg});
    background-position: center;
    background-position: cover;
    :active{
        cursor: ${props => props.panMode.grabbing};
    }
`;

const GroupWrapper = styled.g`
`

const CircleSvg = styled.circle`
    cursor: ${props => props.cursor || "auto"};
`
const PathSvg = styled.path`
    cursor: ${props => props.cursor || "pointer"};
    :hover{
        stroke: #5b6766;
    }
`

const TransformRectNeResize = styled.rect`
    cursor: ne-resize;
`

const TransformRectNwResize = styled.rect`
    cursor: nw-resize;
`

const ForeignObject = styled.foreignObject`
    pointer-events: ${props => props.pointerEventMode || "none"};
`

const ForeignObjectNodeTool = styled.foreignObject`
    outline: 0;
`

const WrapperNodeContent = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center; 
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-wrap;
`

const NodeContent = styled(ContentEditable)`
    width: 100%;
    color: #000000;
    font-size: ${props => props.fontSize || "12px"};
    font-weight: ${props => props.fontWeight || "initial"};
    outline: 0px;
    &::before{
        content: attr(placeholder);
        color: #cccccc;
        display: inline-block;
    }
    &[istexting="true"]:not(:empty)::before{
        display: none;
    }
`

const CreateNode = styled.button`
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50%;
    z-index: 1;
    & path {
        fill: #346297;
    }
    cursor: grab;
    :active{
        cursor: grabbing;
    }
    :hover{
        & path {
            fill: #3cff00;
        }
    }
    &.top{
        rotate: calc(270deg);
    }
    &.left{
        rotate: calc(180deg);
    }
    &.bottom{
        rotate: calc(90deg);
    }
`

const CircleToSetLine = styled.circle`
    r: 5;
    fill: #3cc6b8;
    stroke: #551a1a;
    stroke-width: 1;
    cursor: pointer;
    :active{
        r: 10;
        fill: #ee3b65;
    }
`

const CircleToBezier = styled(CircleToSetLine)`
    fill: #c65e3c;
`

const Line = styled.line`
    stroke: #8f0032;
    stroke-dasharray: 10 5;
`