import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import styled from "styled-components";

function TestSvg() {
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeAnchor, setResizeAnchor] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragAnchor, setDragAnchor] = useState({ x: 0, y: 0 });

    function handleAddCircle() {
        const newCircle = {
            id: uuid(),
            cx: window.innerWidth / 2,
            cy: window.innerHeight / 2,
            r: 40,
        };
        setCircles([...circles, newCircle]);
    }

    function handleCircleClick(circle) {
        setSelectedCircle(circle.id);
    }

    function handleAnchorMouseDown(circle, anchor, e) {
        setIsResizing(true);
        setSelectedCircle(circle.id);
        setResizeAnchor(anchor);
    }

    function handleAnchorMouseMove(e) {
        if (isResizing) {
            const selected = circles.find((c) => c.id === selectedCircle);
            if (!selected) return;
            if (resizeAnchor === "bottom-right") {
                selected.r = Math.sqrt(
                    Math.pow(selected.cx - e.clientX, 2) +
                        Math.pow(selected.cy - e.clientY, 2)
                );
            }
            if (resizeAnchor === "top-left") {
                selected.cx = e.clientX;
                selected.cy = e.clientY;
                selected.r = Math.sqrt(
                    Math.pow(selected.cx - e.clientX, 2) +
                        Math.pow(selected.cy - e.clientY, 2)
                );
            }
            setCircles([...circles]);
        }
    }

    function handleAnchorMouseUp() {
        setIsResizing(false);
        setResizeAnchor(null);
    }

    function handleCircleMouseDown(circle, e) {
        setIsDragging(true);
        setSelectedCircle(circle.id);
        setDragAnchor({ x: e.clientX, y: e.clientY });
    }

    function handleCircleMouseMove(e) {
        if (isDragging) {
            const selected = circles.find((c) => c.id === selectedCircle);
            if (!selected) return;
            selected.cx += e.clientX - dragAnchor.x;
            selected.cy += e.clientY - dragAnchor.y;
            setDragAnchor({ x: e.clientX, y: e.clientY });
            setCircles([...circles]);
        }
    }

    function handleCircleMouseUp() {
        setIsDragging(false);
    }

    return (
        <div>
            <Main>
                <aside>
                    <button onClick={handleAddCircle}>Add Circle</button>
                </aside>
                <Svg
                    // onMouseMove={handleAnchorMouseMove}
                    // onMouseUp={handleAnchorMouseUp}
                    // onMouseLeave={handleCircleMouseUp}
                >
                    {circles.map((circle) => (
                        <g key={circle.id}>
                            <circle
                                cx={circle.cx}
                                cy={circle.cy}
                                r={circle.r}
                                fill={
                                    circle.id === selectedCircle
                                        ? "red"
                                        : "black"
                                }
                                onClick={() => handleCircleClick(circle)}
                                onMouseDown={(e) =>
                                    handleCircleMouseDown(circle, e)
                                }
                                onMouseMove={handleCircleMouseMove}
                                onMouseUp={handleCircleMouseUp}
                            />
                            <circle
                                cx={circle.cx + circle.r}
                                cy={circle.cy + circle.r}
                                r={5}
                                fill={
                                    circle.id === selectedCircle
                                        ? "red"
                                        : "black"
                                }
                                onMouseDown={(e) =>
                                    handleAnchorMouseDown(
                                        circle,
                                        "bottom-right",
                                        e
                                    )
                                }
                            />
                            <circle
                                cx={circle.cx - circle.r}
                                cy={circle.cy - circle.r}
                                r={5}
                                fill={
                                    circle.id === selectedCircle
                                        ? "red"
                                        : "black"
                                }
                                onMouseDown={(e) =>
                                    handleAnchorMouseDown(circle, "top-left", e)
                                }
                            />
                        </g>
                    ))}
                </Svg>
            </Main>
        </div>
    );
}

export default TestSvg;

// style-components
const Main = styled.div`
    display: flex;
`;

const Aside = styled.aside`
    height: calc(100vh - 155px);
`;

const Svg = styled.svg`
    border: 1px solid;
    height: calc(100vh - 155px);
    width: 100%;
`;
