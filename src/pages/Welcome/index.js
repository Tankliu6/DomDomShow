import React from "react";
import styled from "styled-components";
import SvgCanvas from "../Draw";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import background from "../../img/bg_mv_sp.png";
import imgMain from "../../img/mv_img_base.png";
import imgLeft from "../../img/mv_img_panel_05.png";
import imgRight from "../../img/mv_img_guest_04.png";
import imgSecondBackground from "../../img/secondBlockBg.png"; 
import imgTry from "../../img/try.gif";
import media from "../../global/constant/media";
import { ButtonShared } from "../../global/style/sharedStyledComponents";

const Welcome = (props) => {
    const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = props;
 
    const navigate = useNavigate();

    function handleMemberAuth() {
        if (isLoggedIn) {
            navigate("/");
        } else if (!isLoggedIn) {
            navigate("/account");
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
        <WelcomeWrapper>
            <MainBlockWrapper>
                <MainBlock>
                    <Title>
                        心智圖畫，隨手創造
                        <Text>
                            跟著 DomDomShow 一起動動手吧!
                        </Text>
                        {!isLoggedIn && (
                            <ButtonShared onClick={handleMemberAuth}>
                                Login/Signup
                                <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                                </ArrowSvgWhite>
                            </ButtonShared>
                        )}
                        {isLoggedIn && (
                            <ButtonShared className={isLoggedIn ? "active" : ""} onClick={handleMemberLogout}>
                                Logout
                                <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                                </ArrowSvgWhite>                    
                            </ButtonShared>
                        )}
                    </Title>
                    <ImgGroup>
                        <ImgMain src = {imgMain} />
                        <ImgLeft src = {imgLeft} />
                        <ImgRight src = {imgRight} />
                    </ImgGroup>
                </MainBlock>
            </MainBlockWrapper>
            <SecondBlock>
                <Title className="secondBlock">
                    透過心智圖視覺化想法，快速組織構圖即時呈現。
                    <TryGif src={imgTry} />
                </Title>
                <SecondBlockSvgCanvas isLoading={isLoading} setIsLoading={setIsLoading}></SecondBlockSvgCanvas>
            </SecondBlock>
        </WelcomeWrapper>
    )
};

export default Welcome;

// style-components
const WelcomeWrapper = styled.section`
    display: flex;
    flex-direction: column;
`

const MainBlockWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(${background});
    height: calc(100vh - 114px);
    min-height: 660px;
    background-size: cover;
    background-position: center;
`;

const MainBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    margin-bottom: 100px;
    ${media.MEDIA_QUERY_MAX_900} {
        flex-direction: column-reverse;
    }
`

const Title = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-size: 2rem;
    font-weight: 600;
    &.secondBlock {
        font-size: calc(1rem + 0.5vw);
    }
    ${media.MEDIA_QUERY_MAX_900} {
        &.secondBlock {
            font-size: 1.5rem;
        }
    }
    ${media.MEDIA_QUERY_MAX_768} {
        &.secondBlock {
            font-size: 1.3rem;
        }
    }
    ${media.MEDIA_QUERY_MAX_400} {
        &.secondBlock {
            font-size: 1rem;
        }
    }
`

const Text = styled.div`
    font-size: 1.3rem;
    margin-top: 10px;
    padding: 10px;
`

const ImgGroup = styled.div`
    position: relative;
    width: 500px;
    height: 500px;
    ${media.MEDIA_QUERY_MAX_768} {
        width: 400px;
        height: 400px;
    }
    ${media.MEDIA_QUERY_MAX_500} {
        width: 340px;
        height: 340px;
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

const SecondBlock = styled(MainBlock)`
    background-image: url(${imgSecondBackground});
    background-position: center;
    background-size: cover;
    position: relative;
    margin-bottom: 0;
    padding: 300px 50px 300px 50px;
    ${media.MEDIA_QUERY_MAX_900} {
        gap: 100px;
    }
    ${media.MEDIA_QUERY_MAX_768} {
        gap: 50px
    }
`

const SecondBlockSvgCanvas = styled(SvgCanvas)`
`

const TryGif = styled.img`
    position: absolute;
    max-width: 100px;
    transform: rotate(90deg);
    right: -80px;
    bottom: 12px;
    ${media.MEDIA_QUERY_MAX_900} {
        transform: rotate(360deg);
        right: unset;
        max-width: 75px;
        bottom: 50px;
    }
    ${media.MEDIA_QUERY_MAX_768} {
        max-width: 50px;
    }
    ${media.MEDIA_QUERY_MAX_620} {
        bottom: 75px;
    }
`