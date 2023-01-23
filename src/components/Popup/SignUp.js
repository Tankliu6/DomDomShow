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
} from "./style/sharedStyle";
import Close from "../../img/close-btn.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
const SignUp = (props) => {
    const navigate = useNavigate();
    const {
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
        setShowSignIn(true);
        setShowSignUp(false);
    }

    function handleEmail(e) {
        email.current = e.target.value;
        console.log(email.current);
    }

    function handlePassword(e) {
        password.current = e.target.value;
        console.log(password.current);
    }

    function handleSingUpWithEmailAndPassword() {
        if (isLoading === false) {
            setIsLoading(true);
            createUserWithEmailAndPassword(
                auth,
                email.current,
                password.current
            )
                .then((userCredential) => {
                    // signup ok
                    const user = userCredential.user;
                    console.log(user);
                    navigate("/");
                })
                .catch((error) => {
                    // signup fail
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode);
                    console.log(errorMessage);
                    navigate("/");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    console.log("fire");

    return (
        <Wrapper>
            <CloseButton
                src={Close}
                onClick={() => {
                    setShowSignUp(false);
                    setShowSignIn(false);
                }}
            />
            <Title>DomDomShow</Title>
            <Email placeholder="Email" onChange={handleEmail}></Email>
            <Password
                placeholder="Password"
                onChange={handlePassword}
            ></Password>
            <Submit onClick={handleSingUpWithEmailAndPassword}>註冊</Submit>
            <Notice onClick={handleSwitchPopup}>
                已經有帳號了?
                <Hint>登入</Hint>
            </Notice>
        </Wrapper>
    );
};

export default SignUp;
