import React, { useRef, useState } from 'react';
import {
    Wrapper,
    Title,
    Email,
    Password,
    Submit,
    Notice,
    CloseButton,
    Hint,
} from './style/sharedStyle';
import Close from '../../img/close-btn.png';
import { db, auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = (props) => {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        setIsLoggedIn,
        showSignUp,
        setShowSignUp,
        showSignIn,
        setShowSignIn,
        isLoading,
        setIsLoading,
    } = props;
    // const [isLoading, setIsLoading] = useState(false);
    const email = useRef();
    const password = useRef();

    function handleSwitchPopup() {
        setShowSignIn(false);
        setShowSignUp(true);
    }

    function handleEmail(e) {
        email.current = e.target.value;
        console.log(email.current);
    }

    function handlePassword(e) {
        password.current = e.target.value;
        console.log(password.current);
    }

    function handleSingInWithEmailAndPassword() {
        if (isLoading === false) {
            setIsLoading(true);
            signInWithEmailAndPassword(auth, email.current, password.current)
                .then((userCredential) => {
                    // login ok
                    const user = userCredential.user;
                    setIsLoggedIn(true);
                    setShowSignIn(false);
                    console.log(user);
                    navigate('/member/collection');
                })
                .catch((error) => {
                    // login fail
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setIsLoggedIn(false);
                    console.log(errorCode);
                    console.log(errorMessage);
                    navigate('/');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    return (
        <Wrapper>
            <CloseButton
                src={Close}
                onClick={() => {
                    setShowSignIn(false);
                    setShowSignUp(false);
                }}
            />
            <Title>DomDomShow</Title>
            <Email placeholder="Email" onChange={handleEmail}></Email>
            <Password
                placeholder="Password"
                onChange={handlePassword}
            ></Password>
            <Submit onClick={handleSingInWithEmailAndPassword}>登入</Submit>
            <Notice onClick={handleSwitchPopup}>
                還沒有帳號嗎?
                <Hint>註冊</Hint>
            </Notice>
        </Wrapper>
    );
};

export default SignIn;
