import React, { useRef, useState } from "react";
import {
    Wrapper,
    Title,
    Email,
    Password,
    Submit,
    Notice,
    CloseButton,
    Hint,
    Playground
} from "./style/sharedStyle";
import Close from "../../img/close-btn.png";
import { db, auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignIn = (props) => {
    const navigate = useNavigate();
    const {
        isLoggedIn,
        setIsLoggedIn,
        switchDialog,
        setSwitchDialog,
        memberAuthIsLoading,
        setMemberAuthIsLoading,
        showPopUp, 
        setShowPopUp,
        popUpTitleRef
    } = props;
    const email = useRef();
    const password = useRef();
    const [submitOpacity, setSubmitOpacity] = useState();
    const [submitCursor, setSubmitCursor] = useState();

    function handleSwitchDialog() {
        setSwitchDialog(false);
    }

    function handleEmail(e) {
        email.current = e.target.value;
    }

    function handlePassword(e) {
        password.current = e.target.value;
    }

    function handleSingInWithEmailAndPassword() {
        setSubmitCursor("not-allowed");
        setSubmitOpacity(0.6);
        if (memberAuthIsLoading === false) {
            setMemberAuthIsLoading(true);
            signInWithEmailAndPassword(auth, email.current, password.current)
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
            <Email placeholder="Email" onChange={handleEmail}></Email>
            <Password
                placeholder="Password"
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
