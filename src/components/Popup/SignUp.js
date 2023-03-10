import React, { useRef, useState } from "react";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const SignUp = (props) => {
    const navigate = useNavigate();
    const {
        setSwitchDialog,
        memberAuthIsLoading,
        setMemberAuthIsLoading,
        setShowPopUp,
        popUpTitleRef,
        setShowLayer
    } = props;
    const email = useRef();
    const password = useRef();
    const [submitOpacity, setSubmitOpacity] = useState();
    const [submitCursor, setSubmitCursor] = useState();

    function handleSwitchDialog() {
        setSwitchDialog(true)
    }

    function handleEmail(e) {
        email.current = e.target.value;
    }

    function handlePassword(e) {
        password.current = e.target.value;
    }

    function handleSingUpWithEmailAndPassword() {
        setSubmitOpacity(0.6);
        setSubmitCursor("not-allowed");
        setShowLayer("block")
        if (memberAuthIsLoading === false) {
            setMemberAuthIsLoading(true);
            createUserWithEmailAndPassword(
                auth,
                email.current,
                password.current
            )
            .then((userCredential) => {
                // signup ok
                const user = userCredential.user;
                setShowPopUp(true);
                popUpTitleRef.current = "註冊成功";
            })
            .catch((error) => {
                // signup fail
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setShowPopUp(true);
                popUpTitleRef.current = "註冊失敗";
            })
            .finally(() => {
                setMemberAuthIsLoading(false);
                setSubmitCursor("pointer");
                setSubmitOpacity("1");
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
            <Email placeholder="Email" onChange={handleEmail}></Email>
            <Password
                placeholder="Password"
                type="password"
                onChange={handlePassword}
            ></Password>
            <Submit 
                cursor={submitCursor}
                opacity={submitOpacity} 
                onClick={handleSingUpWithEmailAndPassword}
            >
                註冊
            </Submit>            
            <Notice onClick={handleSwitchDialog}>
                已經有帳號了?
                <Hint>登入</Hint>
            </Notice>
            <Playground onClick = {handleNavigateToPlayground}>點我試用
                <Hint>
                    來吧
                </Hint>
            </Playground>
        </Wrapper>
    );
};

export default SignUp;
