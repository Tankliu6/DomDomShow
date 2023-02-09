import styled from "styled-components";
import Close from "../../../img/close-btn.png";

// style-components
export const Wrapper = styled.div`
    /* position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto; */
    z-index: 999;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 16px;
    border: 4px solid #000000;
    width: 320px;
    max-height: 400px;
    padding: 40px;
`;

export const Title = styled.div`
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 20px;
`;

export const Email = styled.input`
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #cccccc;
    :focus {
        outline: none;
    }
`;

export const Password = styled(Email)``;

export const Submit = styled.button`
    cursor: ${props => props.cursor || "pointer"};
    background-color: #000000;
    font-size: 16px;
    color: #ffffff;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    opacity: ${props => props.opacity || 1};
`;

export const Notice = styled.div`
    text-align: center;
    margin-top: 20px;
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

export const Hint = styled.span`
    color: #feae00;
    margin-left: 5px;
`;

export const CloseButton = styled.img`
    position: relative;
    bottom: 20px;
    left: 230px;
    height: 20px;
    width: 20px;
    cursor: pointer;
`;

export const Playground = styled(Notice)`
    margin-top: 20px;
`