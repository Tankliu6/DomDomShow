import styled from 'styled-components';
import React from 'react';
import { useState, useEffect } from 'react';
import SignIn from './Popup/SignIn';
import SignUp from './Popup/SignUp';
import {
    MEDIA_QUERY_MIN_360,
    MEDIA_QUERY_MIN_768,
    MEDIA_QUERY_MIN_1080,
    MEDIA_QUERY_MIN_1200,
    MEDIA_QUERY_MAX_1200,
} from '../global/constant/media';
import { deleteApp } from 'firebase/app';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Header = (props) => {
    const { isLoggedIn, setIsLoggedIn, isLoading, setIsLoading } = props;
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    function handleMemberAuth() {
        if (showSignIn == true || showSignUp == true) {
            setShowSignIn(false);
            setShowSignUp(false);
        } else {
            setShowSignIn(!showSignIn);
            setShowSignUp(!showSignUp);
        }
    }

    function handleMemberLogout() {
        signOut(auth)
            .then(() => {
                // logout ok
                setIsLoggedIn(false);
                console.log('logout');
            })
            .catch((error) => {
                // error
                setIsLoggedIn(false);
                console.log(error.message);
            });
    }

    return (
        <Nav>
            <Wrapper>
                <TitleWrapper />
                <NavRight>
                    <MyDrawWrapper
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        showSignUp={showSignUp}
                        setShowSignUp={setShowSignUp}
                    ></MyDrawWrapper>
                    {!isLoggedIn && (
                        <Auth onClick={handleMemberAuth}>Login/Signup</Auth>
                    )}
                    {isLoggedIn && (
                        <Auth onClick={handleMemberLogout}>Logout</Auth>
                    )}
                </NavRight>
                {showSignIn && (
                    <SignIn
                        showSignUp={showSignUp}
                        setShowSignUp={setShowSignUp}
                        showSignIn={showSignIn}
                        setShowSignIn={setShowSignIn}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                )}
                {showSignUp && (
                    <SignUp
                        showSignUp={showSignUp}
                        setShowSignUp={setShowSignUp}
                        showSignIn={showSignIn}
                        setShowSignIn={setShowSignIn}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                )}
            </Wrapper>
        </Nav>
    );
};

const MyDrawWrapper = (props) => {
    const { isLoggedIn, setIsLoggedIn, showSignUp, setShowSignUp } = props;
    const navigate = useNavigate();
    function handleRedirectToMemberPage() {
        if (isLoggedIn) {
            navigate('/member/collection');
        } else {
            setShowSignUp(true);
        }
    }
    return <MyDraw onClick={handleRedirectToMemberPage}>MyDraw</MyDraw>;
};

function TitleWrapper() {
    const navigate = useNavigate();
    function wayToHome() {
        navigate('/');
    }
    return <Title onClick={wayToHome}>DomDomShow</Title>;
}

export default Header;

// style-component
const Nav = styled.section`
    display: flex;
    justify-content: center;
    background-color: #ffbb00;
    padding: 40px 10px 40px 10px;
    :hover {
        background-color: #fdf3d7;
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
`;

const MyDraw = styled.div`
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

const Auth = styled(MyDraw)`
    color: #ffffff;
    background-color: #d52400;
    border: 2px solid #000000;
`;
