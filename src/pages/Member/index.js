import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { v4 as uuid} from "uuid";
import { useParams, useNavigate } from "react-router-dom";
import { VscTrash } from "react-icons/vsc";
import { TbZoomInArea } from "react-icons/tb";
import { MdFullscreenExit } from "react-icons/md";
import { doc, collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import backgroundImg from "../../img/member-background.png"
import ContainerBackground from "../../img/memberBackground.png" 
import media from "../../global/constant/media";
import garbageIcon from "../../img/garbage.gif";
import nothing from "../../img/nothing.gif";
import nothing2 from "../../img/nothing2.gif";
import nothing3 from "../../img/nothing3.gif"; 
import nothing4 from "../../img/nothing4.gif";
import { AuthContext } from "../../components/AuthContext";

function Member(props) {
    const { isLoading, setIsLoading } = props;
    const navigate = useNavigate();
    const [historyCards, setHistoryCards] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletingId, setDeletingId] = useState();
    const [zoomInUrl, setZoomInUrl] = useState();
    const gifRef = useRef([nothing, nothing2, nothing3, nothing4])
    const userId = useContext(AuthContext);

    useEffect(() => {
        if (!userId) {
            return
        }
        async function fetchData() {
            setIsLoading(true);
            try {
                const q = query(collection(db, "user"), where("userId", "==", userId))
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const randomIndex = Math.floor(Math.random() * gifRef.current.length);
                    const randomGif = gifRef.current[randomIndex];
                    let previewUrl;
                    if (!doc.data().previewUrl) {
                        previewUrl = randomGif;
                    } else {
                        previewUrl = doc.data().previewUrl
                    }
                    let card = {
                        id: doc.id,
                        userId: doc.data().userId,
                        title: doc.data().title,
                        previewUrl: previewUrl
                    }
                    setHistoryCards((prev) => [...prev, card]);
                })
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [userId])

    async function handleAddNewCanvas(e){
        e.stopPropagation();
        if (isLoading) {
            return
        }
        setIsLoading(true);
        try {
            const docRef = await addDoc(collection(db, "user"), { userId: userId, title: "" });
            navigate(`/Draw/member/${docRef.id}`)
        } 
        catch (e) {
            console.log("Error adding document", e)
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleNavigateToHistoryCanvas(e){
        e.stopPropagation();
        navigate(`/Draw/member/${e.target.id}`);
    }

    function handleRemove(e){
        e.stopPropagation();
        if (isDeleting) {
            return
        }
        setIsDeleting(true);
        const id = e.target.id;

        const deleteCanvas = async () => {
            try {
                const canvasDocRef = doc(db, "canvas", id);
                await deleteDoc(canvasDocRef);
                const userDocRef = doc(db, "user", id);
                await deleteDoc(userDocRef);
                const cardsWithoutDeleted = historyCards.filter(card =>
                    card.id !== id
                );     
                setHistoryCards(cardsWithoutDeleted);
            } catch (e) {
                console.log(e)
            } finally {
                setIsDeleting(false)
            }
        }

        deleteCanvas();
    }

    function handleCardZoomIn(e){
        e.stopPropagation();
        const selectedCard = historyCards.find(card => 
            card.id === e.target.id
        )
        setZoomInUrl(selectedCard.previewUrl);
    }

    function handlePopUp(e){
        e.stopPropagation();
    }

    return (
        <Container>
            <CardsWrapper className="cards">
                <Header />
                <Collection>
                    <FirstCard>
                        <Card onClick={handleAddNewCanvas} className="AddCanvas">
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
                    </FirstCard>
                    { historyCards.map((card, index) => 
                        <Card className={`cards ${isDeleting ? "active" : ""}`} key={index} id={card.id} onClick={handleNavigateToHistoryCanvas}>
                            <Preview 
                                className={isDeleting && deletingId === card.id ? "active" : "" } 
                                id={card.id} 
                                previewUrl={card.previewUrl} 
                                remove={garbageIcon} 
                                />
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
                            <WrapperRemoveIcon 
                                id={card.id}
                                title="Delete this canvas" 
                                onClick={handleRemove} 
                                onPointerDown={(e) => {
                                    e.stopPropagation();
                                    setDeletingId(e.target.id)
                                }}>
                                <RemoveIcon size={20} fill="#ffffff" />
                            </WrapperRemoveIcon>
                            <WrapperCardZoomIn 
                                id={card.id}
                                onPointerDown={handleCardZoomIn}
                                onClick={handlePopUp}
                                title="Zoom!"
                            >
                                <ZoomInIcon size={20} fill="#c6f0fc" />
                            </WrapperCardZoomIn>
                        </Card>    
                    )}
                </Collection> 
                <PopUp   
                    className={zoomInUrl ? "active" : ""} 
                    url={zoomInUrl}
                >
                    <FullscreenExit 
                        size={40} 
                        fill="#000000"
                        onPointerDown={e => e.stopPropagation()}
                        onClick={(e) => {
                            e.stopPropagation();
                            setZoomInUrl();
                        }} 
                    />
                </PopUp>
            </CardsWrapper>
        </Container>
    );
};

export default Member;
const Container = styled.div`
    position: relative;
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
    margin-top: 50px;
    margin-bottom: 50px;
    width: 100%;
    padding: 100px 50px 50px 50px;
    ${media.MEDIA_QUERY_MAX_1200} {
        width: 1200px;
    }
    ${media.MEDIA_QUERY_MIN_1200} {
        width: 1200px;
    }
    &.cards::before{
        content: "";
        background-image: url(${backgroundImg});
        background-position-x: left;
        background-position-y: top;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        opacity: 0.9;
    }
`

const FirstCard = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
`

const Preview = styled.div`
    position: absolute;
    top: 10px;
    left: 10px;
    width: 120px;
    height: 120px;
    border-radius: 5px;
    background-image: url(${props => props.previewUrl});
    background-position: initial;
    background-size: cover;
    &.active{
        background-image: url(${props => props.remove});
        pointer-events: none;
    }
`

const Card = styled.div`
    position: relative;
    width: 150px;
    height: 200px;
    border: 4px solid #06126180;
    border-radius: 15px;
    background-color: #fff2c6ff;
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
    &.active, &.active * {
        pointer-events: none;
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
    text-align: center;
`

const Collection = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    padding: 40px 0 0 0;
    width: 100%;
`

const WrapperRemoveIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2a742e;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 30px;
    height: 30px;
    :hover{
        background-color: cadetblue;
        & path{
            fill: black;
        }   
    }
`

const RemoveIcon = styled(VscTrash)`
    pointer-events: none;
`

const WrapperCardZoomIn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 35px;
    right: 0;
    background-color: burlywood;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    :hover{
        background-color: yellow;
    }
`

const ZoomInIcon = styled(TbZoomInArea)`
    pointer-events: none;
`

const PopUp = styled.div`
    visibility: hidden;
    opacity: 0;
    background-image: url(${props => props.url});
    background-size: contain;
    background-repeat: round;
    display: flex;
    justify-content: end;
    padding: 5px;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: #000000;
    box-shadow: 5px 5px 5px #cccccc60;
    max-width: 500px;
    max-height: 282px;
    aspect-ratio: 16/9;
    transition: visibility 0s, opacity 0.5s linear;
    &.active{
        visibility: visible;
        opacity: 1;
    }
`

const FullscreenExit = styled(MdFullscreenExit)`
    cursor: pointer;
    :hover {
        fill: #deb887;
    }
`