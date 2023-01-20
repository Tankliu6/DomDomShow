import Member from './pages/Member';
import Welcome from './pages/Welcome';
import Header from './components/Header';
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import UserContext from './components/userContext';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import Loading from './components/Loading';
const App = () => {
    const [user, setUser] = useState(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (authUser) => {
            console.log('AuthChange');
            if (authUser) {
                // User is signed in
                const { uid } = authUser;
                setUser(uid);
                setIsLoggedIn(true);
                // Retrieve user data from database
            } else {
                setIsLoggedIn(false);
                console.log('Not signedIn');
                navigate('/');
            }
        });
    }, []);
    return (
        <>
            <Loading isLoading={isLoading} setIsLoading={setIsLoading} />
            <UserContext.Provider value={user}>
                <Header
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                />
                <Routes>
                    <Route path="/" element={<Welcome />} />;
                    <Route path="/member/collection" element={<Member />} />;
                </Routes>
            </UserContext.Provider>
        </>
    );
};

export default App;
