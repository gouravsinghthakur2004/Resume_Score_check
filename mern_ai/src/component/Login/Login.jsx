
import style from './Login.module.css'
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import {auth,provider} from "../../Utlis/Firebase"
import {signInWithPopup} from "firebase/auth"
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../Utlis/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "../../Utlis/axios"

function Login() {


 const{isLogin, setLogin, userInfo, setUserInfo}=useContext(AuthContext);

 const navigate=useNavigate();

 const isAuthenticated = isLogin === true || isLogin === "true";

 useEffect(() => {
   if (isAuthenticated && userInfo) {
     if (userInfo.role === "admin") {
       navigate("/admin", { replace: true });
     } else {
       navigate("/dashboard", { replace: true });
     }
   }
 }, [isAuthenticated, userInfo, navigate]);

const handleLogin=async()=>{
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const UserData={
            name:user.displayName,
            email:user.email,
            photoUrl:user.photoURL,
        }

        const response = await axios.post('/api/user', UserData);
        if (response.data.user) {
            const dbUser = response.data.user;
            setUserInfo(dbUser);
            localStorage.setItem("userInfo", JSON.stringify(dbUser));
            setLogin(true);
            localStorage.setItem("isLogin", "true");
            
            if (dbUser.role === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
            console.log("Logged in user:", dbUser);
        } else {
            alert("Login failed: invalid response from server.");
        }
    } catch (error) {
        console.error("Error signing in with Google:", error);
        alert("Sign in failed: " + (error.response?.data?.message || error.message));
    }
}


  return (
    <div className={style.login}>
        <div className={style.loginCard}>
            <div className={style.loginCardTitle}>
                <h1>login</h1>
                <VpnKeyIcon sx={{fontSize: 40}} />
            </div>

            <div className={style.googleBtn} onClick={handleLogin}>
                <GoogleIcon sx={{fontSize: 24,color:"red"}} />
                Sign in with Google
            </div>
        </div>
    </div>
  )
}

export default Login