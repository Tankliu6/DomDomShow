import React from "react";
import styled from "styled-components";




function Zoom(props){
    const { SVGSize } = props;
    const zoomPercent = Math.floor((960 / SVGSize.width) * 100);
    return (
        <Wrapper>
            <Percent>
                {zoomPercent + "%"}
            </Percent>
        </Wrapper>
    )
}

export default Zoom;

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
    right: 126px;
    background-color: #ffffff;
    color: ${props => props.color || "#4a5475"};
    font-weight: 800;
    height: 36px;
    width: 76px;
    box-shadow: 0 0 5px #cccccc;
    border-radius: 5px;
    cursor: pointer;
`
