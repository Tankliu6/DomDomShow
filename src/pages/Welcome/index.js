import React from "react";
import styled from "styled-components";
import background from "../../img/welcome-background.png";

const Welcome = () => {
    return <Content></Content>;
};

export default Welcome;

// style-components
const Content = styled.section`
    background-image: url(${background});
    height: 100vh;
    min-height: 660px;
    background-size: cover;
    background-position: center;
`;
