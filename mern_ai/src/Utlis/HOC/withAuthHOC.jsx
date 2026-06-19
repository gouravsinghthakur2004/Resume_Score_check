import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

const withAuthHOC = (WrappedComponent) => {
    return (props) => {
        const navigate = useNavigate();
        const { isLogin, setLogin } = useContext(AuthContext); 

        const localLogin = localStorage.getItem("isLogin") === "true";

        useEffect(() => {
            const hasLocalLogin = localStorage.getItem("isLogin") === "true";
            if (!hasLocalLogin) {
                setLogin(false);
                navigate("/login", { replace: true });
            } else if (!isLogin) {
                setLogin(true);
            }
        }, [isLogin, navigate, setLogin]);

        const isAuthenticated = isLogin || localLogin;

        if (!isAuthenticated) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthHOC;