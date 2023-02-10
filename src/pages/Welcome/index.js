import React, { useState } from "react";
import styled from "styled-components";
import background from "../../img/bg_mv_sp.png";
import imgMain from "../../img/mv_img_base.png";
import imgLeft from "../../img/mv_img_panel_05.png";
import imgRight from "../../img/mv_img_guest_04.png";
import SignIn from "../../components/Popup/SignIn";
import SignUp from "../../components/Popup/SignUp";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { MEDIA_QUERY_MAX_900 } from "../../global/constant/media";


const Welcome = (props) => {
    const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = props;
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const navigate = useNavigate();

    function handleMemberAuth() {
        if (isLoggedIn) {
            navigate("/");
        } else if (!isLoggedIn) {
            navigate("/login");
        }
    }

    function handleMemberLogout() {
        signOut(auth)
            .then(() => {
                // logout ok
                setIsLoggedIn(false);
                console.log("logout");
            })
            .catch((error) => {
                // error
                setIsLoggedIn(false);
                console.log(error.message);
            });
    }


    return (
        <Background>
            <Content>
                <Title>
                    自由畫板，隨手創造
                    <Text>
                        跟著 DomDomShow 一起動動手吧!
                    </Text>
                    {!isLoggedIn && (
                        <Auth onClick={handleMemberAuth}>
                            Login/Signup
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>
                        </Auth>
                    )}
                    {isLoggedIn && (
                        <Auth onClick={handleMemberLogout}>
                            Logout
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>                    
                        </Auth>
                    )}
                </Title>
                <ImgGroup>
                    <ImgMain src = {imgMain} />
                    <ImgLeft src = {imgLeft} />
                    <ImgRight src = {imgRight} />
                </ImgGroup>    
            </Content>
        </Background>
    )
};

export default Welcome;

// style-components
const Background = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${background});
    height: calc(100vh - 104px);
    /* min-height: 660px; */
    background-size: cover;
    background-position: center;
`;

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin-bottom: 100px;
    ${MEDIA_QUERY_MAX_900} {
        flex-direction: column-reverse;
    }
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-size: 2rem;
    font-weight: 600;
`

const Text = styled.div`
    font-size: 1.3rem;
    margin-top: 10px;
    padding: 10px;
`

const Auth = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
    background-color: var(--color-button-red);
    border: 2px solid #000000;
    box-shadow: 0 4px #000000;
    padding: 10px;
    border-radius: 20px;
    margin-top: 20px;
    font-size: 1.5rem;
    width: 100%;
    cursor: pointer;
    :hover {
        box-shadow: 0 0px #000000;
    }
`;

const ImgGroup = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
    ${MEDIA_QUERY_MAX_900} {
        width: 360px;
        height: 360px;
    }
`

const ImgMain = styled.img`
    position: absolute;
    top: 50px;
    width: 100%;
`
const ImgLeft = styled(ImgMain)`
`

const ImgRight = styled(ImgMain)`
`

const ArrowSvgWhite = styled.svg`
    fill: #ffffff;
    height: 30px;
    margin-left: 15px;
`