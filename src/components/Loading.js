import React from "react";
import styled from "styled-components";
import loading from "../img/loading.gif";
import loadingBackground from "../img/loading-background.png";

function Loading(props) {
    const { isLoading } = props;
    return (
        <>
            <LoadingLayer className={isLoading ? "active" : ""}>
                <LoadingIcon src={loading} />
            </LoadingLayer>
            <LoadingLayerFromRight className={isLoading ? "active" : ""}>
                <LoadingIcon src={loading} />
            </LoadingLayerFromRight>
            <LoadingLayerFromLeft className={isLoading ? "active" : ""}>
                <LoadingIcon src={loading} />
            </LoadingLayerFromLeft>
        </>
    );
}

const LoadingLayer = styled.div`
    visibility: visible;
    opacity: 0;
    pointer-events: none;
    background-image: url(${loadingBackground});
    background-position: center;
    background-size: cover;
    position: fixed;
    z-index: 9999;
    background-color: #ffffff;
    height: 100vh;
    width: 100vw;
    transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
    &.active {
        opacity: 1;
        pointer-events: unset;
    }
`;

const LoadingLayerFromLeft = styled(LoadingLayer)`
    transform: translateX(100%);
    transition: transform 0.5s linear, opacity 0.5s linear;
    &.active {
        transform: translateX(0%);
    }
`

const LoadingLayerFromRight = styled(LoadingLayer)`
    transform: translateX(-100%);
    transition: transform 0.5s linear, opacity 0.5s linear;
    &.active {
        transform: translateX(0%);
    }
`

const LoadingIcon = styled.img`
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`;

export default Loading;
