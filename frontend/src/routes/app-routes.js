import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../components/Home';
import Login from '../pages/Login/Login';
import UserHomePage from '../pages/UserHome/UserHomePage';
import SignUp from '../pages/SignUp/SignUp';
import UserHome from '../pages/UserHome/UserHome';
import ScheduleCollection from '../pages/SheduleWaste/ScheduleCollection';



const AppRoutes = () => {
    return (
      <>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />                  
                  <Route path="/login" element={<Login />} />                  
                  <Route path="/dashboard" element={<UserHomePage />} />                  
                  <Route path="/userHome" element={<UserHome />} />                  
                  <Route path="/signup" element={<SignUp />} />                  
                  <Route path="/sheduleCollection" element={<ScheduleCollection />} />                  
              </Routes>
          </Router>
      </>
    )
  }
  
  export default AppRoutes;