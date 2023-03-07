import React, { useEffect, useRef, useState } from "react";
import {
    Wrapper,
    Title,
    Email,
    Password,
    Submit,
    Notice,
    Hint,
    Playground
} from "./style/sharedStyle";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = (props) => {
    const navigate = useNavigate();
    const {
        setIsLoggedIn,
        setSwitchDialog,
        memberAuthIsLoading,
        setMemberAuthIsLoading,
        setShowPopUp,
        popUpTitleRef,
        setShowLayer
    } = props;
    const emailRef = useRef();
    const passwordRef = useRef();
    const [submitOpacity, setSubmitOpacity] = useState();
    const [submitCursor, setSubmitCursor] = useState();

    useEffect(() => {
        const email = document.querySelector(".email");
        emailRef.current = "test999@test.com";
        email.value = "test999@test.com";
        const password = document.querySelector(".password");
        passwordRef.current = 12345678;
        password.value = 12345678;
    })

    function handleSwitchDialog() {
        setSwitchDialog(false);
    }

    function handleEmail(e) {
        emailRef.current = e.target.value;
    }

    function handlePassword(e) {
        passwordRef.current = e.target.value;
    }

    function handleSingInWithEmailAndPassword() {
        setSubmitCursor("not-allowed");
        setSubmitOpacity(0.6);
        setShowLayer("block")
        if (memberAuthIsLoading === false) {
            setMemberAuthIsLoading(true);
            signInWithEmailAndPassword(auth, emailRef.current, passwordRef.current)
                .then((userCredential) => {
                    // login ok
                    const user = userCredential.user;
                    setMemberAuthIsLoading(false);
                    setIsLoggedIn(true);
                    navigate("/member/collection");
                })
                .catch((error) => {
                    // login fail
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                    setMemberAuthIsLoading(false);
                    setIsLoggedIn(false);
                    setShowPopUp(true)
                    popUpTitleRef.current = "請確認帳號密碼";
                })
                .finally(() => {
                    setMemberAuthIsLoading(false);
                    setSubmitCursor("pointer");
                    setSubmitOpacity(1);
                    setShowLayer("none")
                    setTimeout(() => {
                        setShowPopUp(false)
                    }, 2000)
                });
        }
    }

    function handleNavigateToPlayground(){
        navigate("/Draw/playground");
    }

    return (
        <Wrapper>
            <Title>DomDomShow</Title>
            <Email className="email" placeholder="Email" onChange={handleEmail}></Email>
            <Password
                className="password"
                placeholder="Password"
                type="password"
                onChange={handlePassword}
            ></Password>
            <Submit 
                cursor={submitCursor}
                opacity={submitOpacity} 
                onClick={handleSingInWithEmailAndPassword}
            >
                登入
            </Submit>
            <Notice onClick={handleSwitchDialog}>
                還沒有帳號嗎?
                <Hint>註冊</Hint>
            </Notice>
            <Playground onClick = {handleNavigateToPlayground}>點我試用 
                <Hint>來吧</Hint>
            </Playground>
        </Wrapper>
    );
};

export default SignIn;
