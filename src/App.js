import Member from "./pages/Member";
import Welcome from "./pages/Welcome";
import Header from "./components/Header";
import SvgCanvas from "./pages/Draw/index";
import SingInUp from "./pages/SignInUp";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import UserContext from "./components/userContext";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import Loading from "./components/Loading";
import Layer from "./components/Layer";
const App = () => {
    const [user, setUser] = useState(auth.currentUser ? auth.currentUser.uid : undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLayer, setShowLayer] = useState("none");
    const navigate = useNavigate();
    const location = useLocation();
    console.log(`App through`)
    useEffect(() => {
        setIsLoading(true);
        onAuthStateChanged(auth, (authUser) => {
            console.log("AuthChange");
            if (authUser) {
                // User is signed in
                const { uid } = authUser;
                setUser(uid);
                setIsLoggedIn(true);
                setIsLoading(false);
                // Retrieve user data from database
            } else {
                setIsLoggedIn(false);
                if (location.pathname.split("/")[2] === "playground" || location.pathname.split("/")[1] === "login") {
                    console.log("logout but stay")
                    setIsLoading(false);
                    return
                } else {
                    console.log("Not signedIn");
                    setIsLoading(false);
                    navigate("/");    
                }
            }
        });
    }, [auth]);
    return (
        <>
            <Layer showLayer={showLayer}/>
            <Loading isLoading={isLoading} setIsLoading={setIsLoading} />
            <UserContext.Provider value={user}>
                <Header
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
                <Routes>
                    <Route path="/" element={
                    <Welcome 
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}                        
                    />} />;
                    <Route path="/member/collection" element={<Member isLoading={isLoading} setIsLoading={setIsLoading}/>} />;
                    <Route path="/login" element={<SingInUp 
                        isLoggedIn={isLoggedIn}
                        setIsLoggedIn={setIsLoggedIn}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        setShowLayer={setShowLayer}
                    />} />;
                    <Route path="/Draw/playground" element={<SvgCanvas isLoading={isLoading} setIsLoading={setIsLoading}/>} />;
                    <Route path="/Draw/member/:docId" element={<SvgCanvas isLoading={isLoading} setIsLoading={setIsLoading} />} />;
                </Routes>
            </UserContext.Provider>
        </>
    );
};

export default App;
