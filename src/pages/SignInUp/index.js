import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SignIn from "../../components/Popup/SignIn";
import SignUp from "../../components/Popup/SignUp";
import backgroundImg from "../../img/signinup-background.png";
import handshake from "../../img/handshake.png";
import { MEDIA_QUERY_MAX_900 } from "../../global/constant/media";
import PopUp from "../../components/Popup/PopUp";

function SingInUp(props){
    const {
        isLoggedIn, 
        setIsLoggedIn, 
        setShowLayer
    } = props;
    const popUpTitleRef = useRef("歡迎歡迎~!")
    const [switchDialog, setSwitchDialog] = useState(true);
    const [memberAuthIsLoading, setMemberAuthIsLoading] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);

    useEffect(() => {

    })

    return (
        <Wrapper>
            <Content>
                {switchDialog && (
                    <SignIn
                        switchDialog={switchDialog}
                        setSwitchDialog={setSwitchDialog}
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        memberAuthIsLoading={memberAuthIsLoading}
                        setMemberAuthIsLoading={setMemberAuthIsLoading}
                        showPopUp={showPopUp}
                        setShowPopUp={setShowPopUp}
                        popUpTitleRef={popUpTitleRef}
                        setShowLayer={setShowLayer}
                    />
                )}
                {!switchDialog && (
                    <SignUp
                        switchDialog={switchDialog}
                        setSwitchDialog={setSwitchDialog}
                        memberAuthIsLoading={memberAuthIsLoading}
                        setMemberAuthIsLoading={setMemberAuthIsLoading}
                        showPopUp={showPopUp}
                        setShowPopUp={setShowPopUp}
                        popUpTitleRef={popUpTitleRef}
                        setShowLayer={setShowLayer}
                    />
                )}
                <ImgWrapper>
                    <HandShake src={handshake} />
                    <PopUp 
                        showPopUp={showPopUp} 
                        popUpTitleRef={popUpTitleRef}
                    />
                </ImgWrapper>
            </Content>
            <BackgroundImg src={backgroundImg} />
        </Wrapper>
    )
}

export default SingInUp;

// styled-component
const Wrapper = styled.div`
    background-color: #fef7ae;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 104px);
`

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    ${MEDIA_QUERY_MAX_900}{
        flex-direction: column;
    }
`

const BackgroundImg = styled.img`
    position: absolute;
    max-width: 100%;
    max-height: 100%;
`

const ImgWrapper = styled.div`
    position: relative;
    z-index: 999;
`

const HandShake = styled.img`
    max-width: 100%;
    max-height: 100%;
    z-index: 999;
`