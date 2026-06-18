import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

const withAuthHOC = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const { isLogin, setLogin } = useContext(AuthContext); 

        const isAuthenticated = isLogin === true || isLogin === "true";

        useEffect(() => {
            const localLogin = localStorage.getItem("isLogin");
            if (!localLogin) {
                setLogin(false);
                navigate("/login");
            }
        }, [navigate, setLogin]);

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthHOC;