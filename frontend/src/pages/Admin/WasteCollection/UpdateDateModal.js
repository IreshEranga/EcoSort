import React from 'react';
import './UpdateDateModal.css'; // Add your own styling
import { FaTimes } from 'react-icons/fa'; // Importing an icon (you can choose any icon)

const UpdateDateModal = ({ isOpen, onClose, onUpdate }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleUpdate = (e) => {
    e.preventDefault();
    const selectedDay = e.target.elements.day.value;
    onUpdate(selectedDay);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
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
            <button type="submit" className="update-button">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDateModal;
