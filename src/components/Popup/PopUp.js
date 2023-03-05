import React from "react";
import styled from "styled-components";


function PopUp(props){
    const { showPopUp, popUpTitleRef } = props;
    let popUpDisplay;
    showPopUp ? popUpDisplay = "flex" : popUpDisplay = "none";
    return (
        <Wrapper display={popUpDisplay}>{popUpTitleRef.current}</Wrapper>
    )    
}



export default PopUp



// styled-component
const Wrapper = styled.div`
    display: ${props => props.display || "none"};
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    position: absolute;
    z-index: 999;
    top: 25%;
    left: 25%;
    width: 240px;
    height: 200px;
    text-align: center;
    font-size: 26px;
    font-weight: 800;
    background-color: #ffffff;
    border: 4px solid #000000;
    border-radius: 16px;
`