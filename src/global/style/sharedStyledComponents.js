import styled from "styled-components";

export const ButtonShared = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #ffffff;
    background-color: var(--color-button-red);
    border-width: 2px 2px 3px;
    border: solid #000000;
    box-shadow: 0 4px #000000;
    padding: 10px;
    border-radius: 20px;
    margin-top: 20px;
    font-size: 1.5rem;
    font-weight: 600;
    width: 100%;
    cursor: pointer;
    transition: box-shadow 0.1s ease;
    :hover {
        box-shadow: 0 0px #000000;
    }
    &.active{
        background-color: var(--color-button-blue);
    }
`;