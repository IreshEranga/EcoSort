/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; 

const AssignDriverModal = ({ isOpen, onClose, specialRequestId, date, city }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    if (isOpen && city && date) { // Check if city and date are present
      const fetchAvailableDrivers = async () => {
        try {
          console.log("city",city);
          const response = await axios.get(`http://localhost:8000/api/driver/drivers/available/${city}`);
          setDrivers(response.data);
          console.log(drivers);
        } catch (error) {
          console.error('Error fetching drivers:', error);
        }
      };
      fetchAvailableDrivers();
    }
  }, [isOpen, date, city]);

  const handleAssignDriver = async () => {
    try {
      // Assign the driver
      await axios.post('http://localhost:8000/api/assignDriver', { driverId: selectedDriver, routeId: specialRequestId });

      // Update the special request status to "Assigned"
      await axios.patch(`http://localhost:8000/api/specialRequests/${specialRequestId}`, { collectStatus: 'Assigned' });

      alert('Driver assigned successfully!');
      onClose(); // Close the modal after assignment
    } catch (error) {
      console.error('Error assigning driver:', error);
    }
  };

  if (!isOpen) return null;

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '400px',
    textAlign: 'center',
    position: 'relative', // Make it relative to position the close icon
  };

  const closeIconStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '20px',
    color: '#888',
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <FaTimes style={closeIconStyle} onClick={onClose} />
        <h2>Assign Driver</h2>
        <select onChange={(e) => setSelectedDriver(e.target.value)} value={selectedDriver}>
          <option value="">Select a driver</option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
              {driver.name}
            </option>
          ))}
        </select>
        <button onClick={handleAssignDriver} style={{marginLeft:'10px', borderRadius:'10px'}}>Assign Driver</button>
      </div>
    </div>
  );
};

export default AssignDriverModal;

*/

import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './AssignDriverModal.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const AssignDriverModal = ({ isOpen, onClose, request, drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState('');

  const handleAssignDriver = async () => {
    console.log({ driverId: selectedDriver });


    if (selectedDriver) {
      try {
        const response = await axios.put(`http://localhost:8000/api/special-requests/special-requests/${request._id}/assign-driver`, {
          driverId: selectedDriver,
        });
        // const response = await axios.post(`http://localhost:8000/api/special-requests/assign-driver-special-request`, {
        //   driverId: selectedDriver,
        // });
        console.log('Driver assigned:', response.data);
        toast.success('Driver assigned successfully!');

        const updateStatusResponse = await axios.put(`http://localhost:8000/api/driver/drivers/${selectedDriver}`, {
          status: 'onRide',
        });

        console.log('Driver status updated:', updateStatusResponse.data);
        toast.success('Driver status updated to "onRide".');
        setTimeout(() => {
          onClose();
          window.location.reload();  // Close the modal after the timeout
        }, 5000);
      } catch (error) {
        console.error('Error assigning driver:', error);
        toast.error('Error assigning driver, please try again.');
      }
    } else {
      
      toast.warn('Please select a driver before assigning.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-assignDriver">
      <ToastContainer />
      <div className="modal-content-assignDriver">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        <h2>Assign Driver for Request ID: {request.user.userId}</h2>
        <label htmlFor="driver-select">Select a Driver:</label>
        <select
          id="driver-select"
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
          style={{ padding: '8px', borderRadius: '5px', marginBottom: '20px', width: '100%' }}
        >
          <option value="">--Select Driver--</option>
          {drivers.map(driver => (
            <option key={driver._id} value={driver._id}>
              {driver.name} ({driver.email})
            </option>
          ))}
        </select>
        <button onClick={handleAssignDriver} style={{ padding: '8px', borderRadius: '5px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Assign Driver
        </button>
      </div>
    </div>
  );
};

export default AssignDriverModal;
