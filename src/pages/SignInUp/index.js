import React, { useRef, useState } from "react";
import styled from "styled-components";
import PopUp from "../../components/Popup/PopUp";
import SignIn from "../../components/Popup/SignIn";
import SignUp from "../../components/Popup/SignUp";
import media from "../../global/constant/media";
import backgroundImg from "../../img/signinup-background-01.png";
import handshakeImg from "../../img/handshake.png";

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
                    <HandShake src={handshakeImg} />
                    <PopUp 
                        showPopUp={showPopUp} 
                        popUpTitleRef={popUpTitleRef}
                    />
                </ImgWrapper>
            </Content>
        </Wrapper>
    )
}

export default SingInUp;

// styled-component
const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-yellow);
    background-image: url(${backgroundImg});
    background-position: center;
    background-size: cover;
    width: 100%;
    min-height: calc(100vh - 114px);
`

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    ${media.MEDIA_QUERY_MAX_900}{
        flex-direction: column;
    }
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