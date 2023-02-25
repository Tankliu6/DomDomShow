import React, {useState} from "react";
import styled from "styled-components";


function Message(props){
    const { selectedCircle, circles, setCircles } = props;
    function handleNoteTitle(e){
        e.stopPropagation();
        selectedCircle.title = e.target.value;
        setCircles((prev) => [...prev])
    }
    function handleNoteContent(e){
        e.stopPropagation();
        selectedCircle.content = e.target.value;
        setCircles((prev) => [...prev])
    }

    return (
        <Wrapper className={selectedCircle.id !== "default" ? "active" : "inactive"}>
            <Content>
                <Title value={selectedCircle.title ?? ""} type={"text"} placeholder="Title.." onChange={handleNoteTitle} onPointerDown={e => e.stopPropagation()} />
            </Content>
            <TextArea value={selectedCircle.content ?? ""} placeholder="Add a comment.." onChange={handleNoteContent} onPointerDown={e => e.stopPropagation()} />  
        </Wrapper> 
    )
}

export default Message;


// styled-component
const Wrapper = styled.div`
    display: flex;
    visibility: hidden;
    position: absolute;
    top: 5px;
    left: 5px;
    flex-direction: column;
    align-items: center;
    box-shadow: #00000040 0px 2px 8px 0px;
    width: 240px;
    background-color: var(--color-tool-background);
    opacity: 0;
    transition: 
        visibility 0.5s ease-out, 
        opacity 0.5s linear;
    &.active{
        visibility: visible;
        opacity: 1;
    }
`

const Content = styled.div`
    width: 240px;
    background-color: var(--color-tool-background);
    border-radius: 5px;
    color: #edeaea;
    font-size: 24px;
    text-align: center;
`

const Title = styled.input`
    width: 220px;
    height: 20px;
    border-radius: 2px;
    border: 0;
    outline: none;
    padding: 5px 10px 5px 10px;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 5px;
    background-color: #000000;
    color: #ffffff;
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #9eadba;
    opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #9eadba;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
    color: #9eadba;
    }
`

const TextArea = styled.textarea`
    width: 220px;
    height: 100px;
    border-radius: 3px;
    border: 0;
    outline: none;
    resize: none;
    padding: 5px 10px 0 10px;
    margin-bottom: 10px;
    background-color: #000000;
    color: #ffffff;
    ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #9eadba;
    opacity: 1; /* Firefox */
    }

    :-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #9eadba;
    }

    ::-ms-input-placeholder { /* Microsoft Edge */
    color: #9eadba;
    }
`