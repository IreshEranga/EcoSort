import React from 'react';
import Navbar from '../UserHome/NavbarComponent';
import Footer from '../../components/Footer/Footer';
import './WasteManagement.css';

const WasteManagement = () => {

  return (
    <div className="waste-management">
      <Navbar />

      <div className="my-waste-collection">
        <h3>My Waste Collection</h3>
        <div className="bins">
          
        </div>
      </div>

      <div className="special-waste-collection">
        <h3>Special Waste Collection</h3>
        <button>Add New Request</button>
        <div className="requests">
          
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WasteManagement;