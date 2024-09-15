import React, { useEffect } from 'react'
import Nav from "./Nav"
import Sidebar from "./Component/Sidebar"
import Dashboard from "./Dashboard"
import { Routes, Route } from 'react-router-dom'
import Buy from './Pages/Buy/Buy'
import Create from './Pages/Create/Create'
import Profile from './Pages/Profile/Profile'
const Screen = () => {



  return (
    <div className=" max-w-[1500px] mx-auto  min-h-screen  overflow-hidden   ">


      <div className=" max-w-[1500px] mx-auto md:px-8 px-4 lg:px-16 h-full relative    ">
        <Nav />
        <Sidebar />
        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/Trade/:id" element={<Buy />} />
          <Route path="/Create" element={<Create />} />
          <Route path="/Profile" element={<Profile />} />
          {/* <Route path="/" element={<App />} />
    <Route path="/Buy/:id" element={<Buy />} />
    <Route path="/Token" element={<Token />} />
    <Route path="/Profile" element={<ProfilePage />} /> */}

        </Routes>

      </div>
    </div>
  )
}

export default Screen
