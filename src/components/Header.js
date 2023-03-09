import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import media from "../global/constant/media";
import { ButtonShared } from "../global/style/sharedStyledComponents";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";

const Header = (props) => {
    const { isLoggedIn, setIsLoggedIn } = props;
    const [dropDawnListDisplay, setDropDawnListDisplay] = useState("none");
    const [dropDawnListShowing, setDropDawnListShowing] = useState(false);
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
                navigate("/");
                console.log("logout");
            })
            .catch((error) => {
                // error
                setIsLoggedIn(false);
                navigate("/");
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
                        <AuthButton onClick={handleMemberAuth}>
                            Login/Signup
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>
                        </AuthButton>
                    )}
                    {isLoggedIn && (
                        <AuthButton className={isLoggedIn ? "active" : ""} onClick={handleMemberLogout}>
                            Logout
                            <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                            </ArrowSvgWhite>
                        </AuthButton>
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
                    <AuthButton onClick={handleMemberAuth}>
                        Login/Signup
                        <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                        </ArrowSvgWhite>
                    </AuthButton>
                )}
                {isLoggedIn && (
                    <AuthButton className={isLoggedIn ? "active" : ""} onClick={handleMemberLogout}>
                        Logout
                        <ArrowSvgWhite xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
                        </ArrowSvgWhite>
                    </AuthButton>
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
            navigate("/account");
        }
    }
    return (
        <Button onClick={handleRedirectToMemberPage}>
            MyDraw
            <ArrowSvgBlack xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </ArrowSvgBlack>
        </Button>
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
        <Button onClick = {handleNavigateToPlayground}>
            Playground
            <ArrowSvgBlack xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </ArrowSvgBlack>
        </Button>
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
        background-color: #ffea94;
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
    ${media.MEDIA_QUERY_MIN_1200} {
        width: 1200px;
    }
    ${media.MEDIA_QUERY_MAX_1200} {
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

const Button = styled(ButtonShared)`
    align-items: center;
    color: #000000;
    background-color: #ffffff;
    margin-right: 10px;
    border-radius: 20px;
    margin-top: 0;
`;

const ArrowSvgBlack = styled.svg`
    margin-left: 5px;
    height: 20px;
`

const ArrowSvgWhite = styled(ArrowSvgBlack)`
    fill: white;
`

const AuthButton = styled(ButtonShared)`
    text-align: center;
    color: #ffffff;
    background-color: var(--color-button-red);
    border: 2px solid #000000;
    margin-top: 0px;
    &.active{
        background-color: var(--color-button-blue);
    }
`;

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
        gap: 20px;
        position: absolute;
        top: 104px;
        right: 0;
        padding: 20px;
        z-index: 900;
        background-color: #ffffff;
        border-radius: 10px;
        border: 3px solid #000000;
        div{
            display: flex;
            justify-content: space-between;
            margin-right: 0px;
        }
    }
`