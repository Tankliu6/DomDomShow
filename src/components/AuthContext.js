import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthContextProvider = (props) => {
    const { children, isLoading, setIsLoading, isLoggedIn, setIsLoggedIn } = props;
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);
        if (!isLoading) {
            auth.onAuthStateChanged(authUser => {
                try {
                    setUser(authUser.uid);
                    setIsLoggedIn(true);
                } catch (e) {
                    setIsLoggedIn(false);
                    if (location.pathname.split("/")[2] === "playground" || location.pathname.split("/")[1] === "account") {
                        console.log("No Auth-ok-page")
                    } else {
                        console.log("AuthContext Not Signed-in user" + e);
                        navigate("/");
                    }
                } finally {
                    setIsLoading(false);
                }
            });    
        }
    }, [])

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export { AuthContextProvider, AuthContext };
