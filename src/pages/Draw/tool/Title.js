import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { db, auth } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
import html2canvas from "html2canvas";
import { TfiSave } from "react-icons/tfi";
import { HiRefresh } from "react-icons/hi";
import { BsExclamation } from "react-icons/bs";

function TitleBoard(props) {
    const { viewBoxOrigin, SVGSize, circles, lines, title, setTitle } = props
    const [isSaving, setIsSaving] = useState(false);
    const [titleActive, setTitleActive] = useState(false);
    const [saved, setSaved] = useState(false);
    const location= useLocation();
    const isWelcomePage = location.pathname;
    const isPlayground = location.pathname.split("/")[2];
    const canvasId = location.pathname.split("/")[3];

    async function handleSave(e){
        if (isSaving) return;
        e.stopPropagation();
        setIsSaving(true);
        
        try {
            await setDoc(doc(db, "canvas", canvasId), {
                viewBoxOrigin: viewBoxOrigin,
                SVGSize: SVGSize,
                circles: circles, 
                lines: lines,
                title: title
            })

            const handleCapture = async () => {
                const canvas = await html2canvas(document.body, {foreignObjectRendering: true})
                const url = canvas.toDataURL("image/png");
                await setDoc(doc(db, "user", canvasId), {
                    title: title,
                    userId: auth.currentUser.uid,
                    previewUrl: url
                })
            }

            handleCapture();
            setSaved(true);
        } catch (e) {
            console.log(e);
        } finally {
            setIsSaving(false);
        }
    }

    function handleTitle(e){
        e.stopPropagation();
        setTitle(e.target.value);
    }

    useEffect(() => {
        setSaved(false);
    }, [title, viewBoxOrigin, SVGSize, circles, lines])

    return (
        <Wrapper className={isWelcomePage === "/" ? "welcomePage" : ""}>
            <Title
                value={title} 
                className={titleActive ? "active" : ""} 
                placeholder="Title"
                onChange={handleTitle}
                onClick={() => setTitleActive(!titleActive)}
            />
            <Line />
            { isPlayground === "playground" || isWelcomePage === "/" ? ""
                :
                <Save onClick={handleSave}>
                    <RefreshIcon className={isSaving ? "active" : ""} size={20} fill="#ffffff" />
                    <SaveIcon className={isSaving ? "active" : ""} size={20} fill="#ffffff" />
                    {saved && !isSaving ? "Saved" : isSaving ? "Saving..." : "Unsaved"}
                    <ExclamationMark className={!saved ? "active" : ""} size={35} fill="#fffb00" />
                </Save>
            }
        </Wrapper>
    )
}

export default TitleBoard;

// styled-components
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    position: absolute;
    left: 20px;
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--color-tool-background);
    &.welcomePage{
        display: none;
    }
`

const Title = styled.input`
    border: 0;
    height: 40px;
    padding: 5px;
    font-size: 16px;
    font-weight: 600;
    outline: none;
    transition: 
        font-size 0.5s ease-in-out, 
        font-weight 0.5s linear;
    &.active{
        font-size: 24px;
        font-weight: 600;
    }
`

const Line = styled.div`
    width: 1px;
    height: 30px;
    background-color: #dad2d2;
`

const Save = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    padding: 5px 10px 5px 10px;
    gap: 10px;
    height: 36px;
    border-radius: 5px;
    background-color: var(--color-tool-block);
    color: #ffffff;
    font-weight: 600;
    :hover{
        background-color: #000000;
    }
`

const SaveIcon = styled(TfiSave)`
    cursor: pointer;
    &.active{
        display: none;
    }
`

const RefreshIcon = styled(HiRefresh)`
    display: none;
    animation: rotate 2s infinite;

    @keyframes rotate {
        to {
        transform: rotate(360deg);
        }
    }

    &.active{
        display: block;
    }
`;

const ExclamationMark = styled(BsExclamation)`
    display: none;
    position: absolute;
    top: -15px;
    right: -25px;
    background-color: #d31616;
    border-radius: 50%;    
    &.active{
        display: block;
    }
`

