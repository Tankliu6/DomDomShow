import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import backgroundImg from "../../img/construction.jpg"

const Member = () => {
    const navigate = useNavigate();
    return (
        <Wrapper>
            <BackgroundImg>
                <Content onClick={() => navigate("/Draw/playground")}>會員頁面施工中，Playground</Content>
            </BackgroundImg>
        </Wrapper>
    );
};

export default Member;
const Wrapper = styled.div`
    display: flex;
`

const BackgroundImg = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${backgroundImg});
    min-height: calc(100vh - 104px);
    width: 100%;
    background-size: cover;
    background-position: center;
`

const Content = styled.div`
    background-color: #cccccc;
    text-align: center;
    font-size: 50px;
    box-shadow: 0 0 15px #000000;
    cursor: pointer;
    :hover{
        background-color: #000000;
        color: #ffffff;
    }
`