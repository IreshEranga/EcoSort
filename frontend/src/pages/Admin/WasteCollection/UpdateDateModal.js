import React from 'react';
import './UpdateDateModal.css'; // Add your own styling

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
        <h2>Update Waste Collection Date</h2>
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
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDateModal;
