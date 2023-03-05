import React from "react";
import styled from "styled-components";
import loading from "../img/loading.gif";
import loadingBackground from "../img/loading-background.png";
function Loading(props) {
    const { isLoading, setIsLoading } = props;
    return (
        <>
            <LoadingLayer isLoading={isLoading}>
                <LoadingIcon src={loading} />
            </LoadingLayer>
        </>
    );
}

const LoadingLayer = styled.div`
    display: ${(props) => (props.isLoading ? "block" : "none")};
    background-image: url(${loadingBackground});
    background-position: center;
    background-size: cover;
    position: fixed;
    z-index: 9999;
    background-color: #ffffff;
    height: 100vh;
    width: 100vw;
`;

const LoadingIcon = styled.img`
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`;

export default Loading;
