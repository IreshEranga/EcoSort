import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../components/Home';
import Login from '../pages/Login/Login';
import UserHomePage from '../pages/UserHome/UserHomePage';
import SignUp from '../pages/SignUp/SignUp';




const AppRoutes = () => {
    return (
      <>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />                  
                  <Route path="/login" element={<Login />} />                  
                  <Route path="/dashboard" element={<UserHomePage />} />                  
                  <Route path="/signup" element={<SignUp />} />                  
              </Routes>
          </Router>
      </>
    )
  }
  
  export default AppRoutes;