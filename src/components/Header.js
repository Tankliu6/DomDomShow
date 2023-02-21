import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import SignIn from "./Popup/SignIn";
import SignUp from "./Popup/SignUp";
import {
    MEDIA_QUERY_MIN_360,
    MEDIA_QUERY_MIN_768,
    MEDIA_QUERY_MIN_1080,
    MEDIA_QUERY_MIN_1200,
    MEDIA_QUERY_MAX_1200,
} from "../global/constant/media";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import media from "../global/constant/media";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";

const Header = (props) => {
    const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = props;
    const [dropDawnListDisplay, setDropDawnListDisplay] = useState("none");
    const [dropDawnListShowing, setDropDawnListShowing] = useState(false);
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

    function handleDropDawnList(){
        if (dropDawnListShowing){
            setDropDawnListDisplay("none");
            setDropDawnListShowing(false)
        } else {
            setDropDawnListDisplay("flex");
            setDropDawnListShowing(true);
        }
    }

    useEffect(() => {
        setDropDawnListDisplay("none");
        setDropDawnListShowing(false);
    }, [window.location.pathname])

    return (
        <Nav>
            <Wrapper>
                <TitleWrapper />
                <NavRight>
                    <PlaygroundWrapper />
                    <MyDrawWrapper
                        isLoggedIn={isLoggedIn}
                    ></MyDrawWrapper>
                    {!isLoggedIn && (
                        <Auth onClick={handleMemberAuth}>
                            Login/Signup
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>
                        </Auth>
                    )}
                    {isLoggedIn && (
                        <Auth className={isLoggedIn ? "active" : ""} onClick={handleMemberLogout}>
                            Logout
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>
                        </Auth>
                    )}
                </NavRight>
                {   
                    !dropDawnListShowing &&
                    <Hamburger onClick={handleDropDawnList}>
                        <HiOutlineMenuAlt4 size={40} style={{ fill: "#000000" }}/>
                    </Hamburger>
                }
                {   
                    dropDawnListShowing &&
                    <Hamburger onClick={handleDropDawnList}>
                        <RxCross1 size={40} style={{ fill: "#000000" }}/>
                    </Hamburger>
                }
            </Wrapper>
            <DropDawnList display={dropDawnListDisplay}>
                <PlaygroundWrapper />
                <MyDrawWrapper
                    isLoggedIn={isLoggedIn}
                >
                </MyDrawWrapper>
                {!isLoggedIn && (
                    <Auth onClick={handleMemberAuth}>
                        Login/Signup
                        <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                        </ArrowSvgWhite>
                    </Auth>
                )}
                {isLoggedIn && (
                    <Auth className={isLoggedIn ? "active" : ""} onClick={handleMemberLogout}>
                        Logout
                        <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                        </ArrowSvgWhite>
                    </Auth>
                )}
            </DropDawnList>
        </Nav>
    );
};

const MyDrawWrapper = (props) => {
    const { isLoggedIn } = props;
    const navigate = useNavigate();
    function handleRedirectToMemberPage() {
        if (isLoggedIn) {
            navigate("/member/collection");
        } else {
            navigate("/login");
        }
    }
    return (
        <MyDraw onClick={handleRedirectToMemberPage}>
            MyDraw
            <ArrowSvgBlack xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </ArrowSvgBlack>
        </MyDraw>
        )
};

function TitleWrapper() {
    const navigate = useNavigate();
    function wayToHome() {
        navigate("/");
    }
    return <Title onClick={wayToHome}>DomDomShow</Title>;
}

function PlaygroundWrapper() {
    const navigate = useNavigate();
    function handleNavigateToPlayground() {
        navigate("/Draw/playground");
    }
    return (
        <Playground onClick = {handleNavigateToPlayground}>
            Playground
            <ArrowSvgBlack xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </ArrowSvgBlack>
        </Playground>
    )
}

export default Header;

// style-component
const Nav = styled.section`
    position: relative;
    z-index: 999;
    display: flex;
    justify-content: center;
    background-color: var(--color-background-yellow);
    padding: 30px 10px 30px 10px;
    :hover {
        background-color: #ffffff;
    }
    ${media.MEDIA_QUERY_MIN_900} {
        padding: 20px 10px 20px 10px;
    }
`;

const Wrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${MEDIA_QUERY_MIN_1200} {
        width: 1200px;
    }
    ${MEDIA_QUERY_MAX_1200} {
        width: 1200px;
    }
`;

const Title = styled.div`
    font-size: 1.5rem;
    font-weight: 900;
    padding: 10px;
    cursor: pointer;
`;

const NavRight = styled.div`
    display: flex;
    font-weight: 600;
    padding: 10px;
    ${media.MEDIA_QUERY_MAX_900}{
        display: none;
    }
`;

const MyDraw = styled.div`
    display: flex;
    align-items: center;
    color: #000000;
    background-color: #ffffff;
    border: 2px solid #000000;
    box-shadow: 0 2px #000000;
    padding: 10px;
    margin-right: 10px;
    border-radius: 20px;
    cursor: pointer;
    :hover {
        box-shadow: 0 0px #000000;
    }
`;

const ArrowSvgBlack = styled.svg`
    margin-left: 5px;
    height: 20px;
`

export const ArrowSvgWhite = styled(ArrowSvgBlack)`
    fill: white;
`

const Auth = styled(MyDraw)`
    text-align: center;
    color: #ffffff;
    background-color: var(--color-button-red);
    border: 2px solid #000000;
    &.active{
        background-color: var(--color-button-blue);
    }
`;

const Playground = styled(MyDraw)`

`

const Hamburger = styled.div`
    display: none;
    ${media.MEDIA_QUERY_MAX_900}{
        display: block;
        height: 40px;
        width: 40px;
        margin-right: 10px;
        cursor: pointer;
    }
`

const DropDawnList = styled.div`
    display: none;
    ${media.MEDIA_QUERY_MAX_900}{
        // flex || none
        display: ${props => props.display || none};
        flex-direction: column;
        gap: 15px;
        position: absolute;
        top: 104px;
        right: 0;
        height: 200px !important;
        width: 200px !important;
        padding: 20px;
        z-index: 900;
        background-color: #ffffff;
        border-radius: 10px;
        border: 2px solid #000000;
        div{
            display: flex;
            justify-content: space-between;
            margin-right: 0px;
        }
    }
`