import { useState, useContext } from 'react'
import './App.css'
import SideBar from './component/SideBar'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'
import { AuthContext } from './Utlis/AuthContext'
import MenuIcon from '@mui/icons-material/Menu'

const NavigateToHome = () => {
  const { isLogin, userInfo } = useContext(AuthContext);
  const isAuthenticated = isLogin === true || isLogin === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userInfo?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

function App() {
  const { isLogin } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthenticated = isLogin === true || isLogin === "true";

  return (
    <div className='App'>
      {isAuthenticated && (
        <>
          <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="mobileHeader">
            <button className="menuBtn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <MenuIcon />
            </button>
            <div className="mobileHeaderTitle">Resume Screening</div>
            <div style={{ width: 24 }} />
          </div>
        </>
      )}
      
      <div className={isAuthenticated ? "mainContent withSidebar" : "mainContent"}>
        <Routes>
          <Route path="/" element={<NavigateToHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
