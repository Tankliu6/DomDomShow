import React from "react";
import styled from "styled-components";

function Layer(props){
    const { showLayer } = props;
    return (
        <LayerBody display={showLayer}></LayerBody>
    )
}

export default Layer;

// styled-component
const LayerBody = styled.div`
    display: ${props => props.display || "none"};
    position: absolute;
    z-index: 1;
    height: 100vh;
    width: 100vw;
    background-color: #ffffff;
    opacity: 0.3;
`