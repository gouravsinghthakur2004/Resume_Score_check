import React, { useContext } from 'react'
import style from './Sidebar/Sidebar.module.css'
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Utlis/AuthContext';
import { auth } from '../Utlis/Firebase';
import { signOut } from 'firebase/auth';

function SideBar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLogin, setUserInfo, userInfo } = useContext(AuthContext);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (onClose) onClose();
    try {
      await signOut(auth);
      localStorage.removeItem("isLogin");
      localStorage.removeItem("userInfo");
      setLogin(false);
      setUserInfo(null);
      navigate("/login");
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const sidebarClass = [
    style.sideBar,
    isOpen ? style.sideBarActive : ''
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {isOpen && <div className={style.backdrop} onClick={onClose} />}

      <div className={sidebarClass}>
          {/* Close button for mobile drawer */}
          <button className={style.closeBtn} onClick={onClose} aria-label="Close menu">
              <CloseIcon sx={{ fontSize: 24 }} />
          </button>

          <div className={style.sideBarIcon}>
              <ArticleIcon sx={{fontSize: 54 ,marginBottom:2}} />
              <div className={style.sideBarTopContent}>
                  Resume Screening
              </div>
          </div>
          <div className={style.sideBarOptionBlock}>
              <Link to="/dashboard" onClick={handleLinkClick} className={[style.sideBarOption, location.pathname === "/dashboard" ? style.selectedOption : null].join(' ')}>
                  <DashboardIcon sx={{fontSize: 22}} />
                 <div>Dashboard</div> 
              </Link>

              <Link to="/history" onClick={handleLinkClick} className={[style.sideBarOption, location.pathname === "/history" ? style.selectedOption : null].join(' ')}>
                  <HistoryIcon sx={{fontSize: 22}} />
                 <div>History</div> 
              </Link>

              {userInfo?.role === "admin" && (
                <Link to="/admin" onClick={handleLinkClick} className={[style.sideBarOption, location.pathname === "/admin" ? style.selectedOption : null].join(' ')}>
                    <AdminPanelSettingsIcon sx={{fontSize: 22}} />
                   <div>Admin</div> 
                </Link>
              )}

              <Link to="/login" onClick={handleLogout} className={[style.sideBarOption, location.pathname === "/login" ? style.selectedOption : null].join(' ')}>
                  <LogoutIcon sx={{fontSize: 22}} />
                 <div>LogOut</div> 
              </Link>
          </div>
      </div>
    </>
  )
}

export default SideBar;