import { createContext, useState } from "react"; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isLogin, setLoginState] = useState(() => {
        return localStorage.getItem("isLogin") === "true";
    });
    
    const [userInfo, setUserInfoState] = useState(() => {
        const userInfoData = localStorage.getItem("userInfo");
        if (userInfoData) {
            try {
                return JSON.parse(userInfoData);
            } catch (e) {
                console.error("Failed to parse userInfo from localStorage", e);
                return null;
            }
        }
        return null;
    });

    const setLogin = (val) => {
        setLoginState(val);
        localStorage.setItem("isLogin", val ? "true" : "false");
    };

    const setUserInfo = (val) => {
        setUserInfoState(val);
        if (val) {
            localStorage.setItem("userInfo", JSON.stringify(val));
        } else {
            localStorage.removeItem("userInfo");
        }
    };

    return (
        <AuthContext.Provider value={{ isLogin, setLogin, userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;