import React, { useState } from 'react';
import './UpdateDateModal.css'; // Add your own styling
import { FaTimes } from 'react-icons/fa'; // Importing an icon (you can choose any icon)
import axios from 'axios'; // Make sure to install axios if you haven't

const UpdateDateModal = ({ isOpen, onClose, _id }) => { // Add userId prop
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [loading, setLoading] = useState(false); // State for loading

  const handleUpdate = async (e) => {
    e.preventDefault();
    const selectedDay = e.target.elements.day.value;
    setLoading(true); // Set loading state

    try {
      // Update the waste collection date via API call
      const response = await axios.put(`http://localhost:8000/api/users/${_id}/waste-collection-date`, {
        wasteCollectionDate: selectedDay,
      });

      console.log(response.data); // Log response for debugging
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating waste collection date:', error); // Log error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{backgroundColor:'#f9f9f9', width:'500px'}}>
        <div className="modal-header">
          <h2>Update Waste Collection Date</h2>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleUpdate}>
          <label>
            Select Day:
            <select name="day" required>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </label>
          <div className="button-container"> {/* Added a container for better styling */}
            <button type="submit" className="update-button" disabled={loading}>
              {loading ? 'Updating...' : 'Update'} {/* Show loading text if in progress */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDateModal;
