import React, {useState} from "react";
import styled from "styled-components";
import titleIcon from "../../../img/title.png"
import { IoMdArrowDropdown } from "react-icons/io";

function Message(props){
    const { selectedCircle, circles, setCircles } = props;
    const [contentShow, setContentShow] = useState(false);
    function handleNoteTitle(e){
        e.stopPropagation();
        selectedCircle.title = e.target.value;
        setCircles([...circles])
    }
    function handleNoteContent(e){
        e.stopPropagation();
        selectedCircle.content = e.target.value;
        setCircles([...circles])
    }
    function handleNoteConteShow(){
        setContentShow(!contentShow);
    }
    return (
        <Wrapper className={selectedCircle.id !== "default" ? "active" : "inactive"}>
            <Content>
                <Arrow className={contentShow ? "active" : ""} onClick={handleNoteConteShow}></Arrow>
                NOTE
                <Line />
                <Title value={selectedCircle.title ?? ""} type={"text"} placeholder="Title.." onChange={handleNoteTitle} />
            </Content>
            <TextArea className={contentShow ? "show" : ""} value={selectedCircle.content ?? ""} placeholder="Text something.." onChange={handleNoteContent}></TextArea>    
        </Wrapper> 
    )
}

export default Message;


// styled-component
const Wrapper = styled.div`
    display: flex;
    visibility: hidden;
    position: absolute;
    right: 20px;
    margin-top: 20px;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    width: 240px;
    padding: 10px;
    background-color: #4b5c6b;
    opacity: 0;
    cursor: move;
    transition: 
        visibility 0.5s ease-out, 
        opacity 0.5s linear;
    &.active{
        visibility: visible;
        opacity: 1;
    }
`

const Line = styled.div`
    height: 1px;
    width: 90%;
    background-color: #dad2d2;
`

const Content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 240px;
    background-color: #4b5c6b;
    border-radius: 5px;
    color: #edeaea;
    font-size: 24px;
    text-align: center;
    padding: 5px;
`

const Title = styled.input`
    width: 220px;
    height: 40px;
    border-radius: 2px;
    border: 0;
    outline: none;
    padding: 10px 15px 10px 35px;
    font-size: 16px;
    background-image: url(${titleIcon});
    background-size: 25px 25px;
    background-position: 5px 7px;
    background-repeat: no-repeat;
`

const TextArea = styled.textarea`
    display: none;
    width: 220px;
    height: 0;
    border-radius: 3px;
    outline: none;
    resize: none;
    &.show{
        display: block;
        padding: 10px;
        font-size: 16px;
        min-height: 40px;
        height: 300px;
    }
`

const Arrow = styled(IoMdArrowDropdown)`
    position: absolute;
    right: 40px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
    &.active{
        transform: rotate(180deg);
    }
`