import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from '../components/Home';
import Login from '../pages/Login/Login';

const AppRoutes = () => {
    return (
      <>
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />                  
                  <Route path="/login" element={<Login />} />                  
              </Routes>
          </Router>
      </>
    )
  }
  
  export default AppRoutes;