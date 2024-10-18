import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; 

const AssignDriverModal = ({ isOpen, onClose, specialRequestId, date, city }) => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    if (isOpen && city && date) { // Check if city and date are present
      const fetchAvailableDrivers = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/drivers/available/${city}/${date}`);
          setDrivers(response.data);
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