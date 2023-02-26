import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import backgroundImg from "../../img/member-background.png"
import ContainerBackground from "../../img/memberBackground.png" 
import media from "../../global/constant/media";
const Member = () => {
    const navigate = useNavigate();
    const [historyCards, setHistoryCards] = useState([{id: "test-2131-ef1re65", title: "吃瓜群眾edef超多1321字"}]);

    function handleNavigateToHistoryCanvas(e){
        e.stopPropagation();
        // console.log(e.target.id)
        navigate(`/Draw/${e.target.id}`);
    }
    return (
        <Container>
            <CardsWrapper>
                <Header />
                <Card className="AddCanvas">
                    <svg
                        width={150}
                        height={200}
                    >
                        <rect
                            x={11}
                            y={11}
                            width={120}
                            height={170}
                            stroke="#06126180"
                            strokeWidth={6}
                            strokeDasharray="40, 40, 80, 90, 80, 40, 80, 90, 40"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="transparent"
                        />
                        <line
                            x1={71}
                            y1={75}
                            x2={71}
                            y2={115}
                            stroke="#8f9da1"
                            strokeWidth={5}
                            strokeLinecap="round"
                        />
                        <line
                            x1={50}
                            y1={95}
                            x2={90}
                            y2={95}
                            stroke="#8f9da1"
                            strokeWidth={5}
                            strokeLinecap="round"
                        />
                    </svg>
                </Card>
                <Collection>
                    {historyCards.map((card, index) => 
                        <Card className="cards" key={index} id={card.id} onClick={handleNavigateToHistoryCanvas}>
                            <svg
                                id={card.id} 
                                width={150}
                                height={200}
                            >
                                <line
                                    id={card.id}
                                    x1={10}
                                    y1={140}
                                    x2={130}
                                    y2={140}
                                    stroke="#8f9da1"
                                    strokeWidth={5}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <Title id={card.id}>{card.title}</Title>
                        </Card>    
                    )}
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                    <Card></Card>
                </Collection> 
            </CardsWrapper>
        </Container>
    );
};

export default Member;
const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: calc(100vh - 104px);
    background-color: #fff4b1ad;
    padding: 0 50px 0 50px;
    box-shadow: 5px 5px 5px #d4ceb2c7;
    border-radius: 5px;
    background-image: url(${ContainerBackground});
    background-size: cover;
    background-position: center;
`

const Header = styled.div`
    position: absolute;
    top: 0;
    left: 7px;
    width: calc(100% - 7px);
    height: 50px;
    background-color: #2a742e;
`

const CardsWrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    background-image: url(${backgroundImg});
    margin-top: 50px;
    margin-bottom: 50px;
    width: 100%;
    background-position-x: left;
    background-position-y: top;
    padding: 100px 50px 50px 50px;
    ${media.MEDIA_QUERY_MAX_1200} {
        width: 1200px;
    }
    ${media.MEDIA_QUERY_MIN_1200} {
        width: 1200px;
    }
`

const Card = styled.div`
    position: relative;
    width: 150px;
    height: 200px;
    border: 4px solid #06126180;
    border-radius: 15px;
    background-color: #fff2c6ed;
    cursor: pointer;
    :hover{
        box-shadow: 5px 5px 5px #cccccc60;
    }
    &.AddCanvas :hover{
        & rect,
        & line {
            stroke: #d35f5f;
        }
    }
    &.cards :active{
        & line {
            stroke: #76d59b;
        }
    }
`

const Title = styled.div`
    position: absolute;
    bottom: 10px;
    left: 7px;
    display: block;
    color: #5db15e;
    font-size: 24px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 125px; /* 設置元素的寬度 */
`

const Collection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    padding: 40px 0 0 0;
    width: 100%;
`