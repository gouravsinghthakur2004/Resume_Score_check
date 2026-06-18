import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import SideBar from './component/SideBar'
import {Routes,Route} from 'react-router-dom'
import Dashboard, { Dashboard as UnwrappedDashboard } from './component/Dashboard/Dashboard'
import History from './component/History/History'
import Admin from './component/Admin/Admin'
import Login from './component/Login/Login'



function App() {
  const [count, setCount] = useState(0)

  return (
   <div className='App'>
    <SideBar/>
    <Routes>
      
      <Route path="/login" element={<><UnwrappedDashboard /><Login /></>} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
      <Route path="/admin" element={<Admin />} />

    </Routes>
   </div>
  )
}

export default App
