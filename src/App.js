import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./components/AuthContext";
import Member from "./pages/Member";
import Welcome from "./pages/Welcome";
import Header from "./components/Header";
import SvgCanvas from "./pages/Draw/index";
import Account from "./pages/Account";
import Loading from "./components/Loading";
import Layer from "./components/Layer";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLayer, setShowLayer] = useState("none");

    return (
        <AuthContextProvider isLoading={isLoading} setIsLoading={setIsLoading} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
            <Layer showLayer={showLayer}/>
            <Loading isLoading={isLoading} />
                <Header
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <Welcome 
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                            />
                        } 
                    />
                    <Route 
                        path="/member/collection" 
                        element={
                            <Member 
                                isLoading={isLoading} 
                                setIsLoading={setIsLoading}
                            />   
                        } 
                    />
                    <Route 
                        path="/account" 
                        element={
                            <Account 
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                setShowLayer={setShowLayer}
                            />
                        } 
                    />
                    <Route 
                        path="/Draw/playground" 
                        element={
                            <SvgCanvas 
                                isLoading={isLoading} 
                                setIsLoading={setIsLoading}
                            />
                        } 
                    />
                    <Route 
                        path="/Draw/member/:docId" 
                        element={
                            <SvgCanvas 
                                isLoading={isLoading} 
                                setIsLoading={setIsLoading} 
                            />
                        } 
                    />
                </Routes>
        </AuthContextProvider>
    );
};

export default App;
