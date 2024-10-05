import React, { useState } from 'react';
import axios from 'axios';

function ScheduleCollection() {
  const [scheduledDate, setScheduledDate] = useState('');
  const [wasteType, setWasteType] = useState('');

  const handleSchedule = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming the user ID is stored here
      const response = await axios.post('http://localhost:8000/api/user/schedule', {
        userId,
        wasteType,
        scheduledDate,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Error scheduling collection');
    }
  };

  return (
    <div>
      <h2>Schedule Waste Collection</h2>
      <input 
        type="date" 
        value={scheduledDate} 
        onChange={(e) => setScheduledDate(e.target.value)} 
      />
      <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
        <option value="">Select Waste Type</option>
        <option value="general">General</option>
        <option value="recyclable">Recyclable</option>
        <option value="hazardous">Hazardous</option>
      </select>
      <button onClick={handleSchedule}>Schedule</button>
    </div>
  );
}

export default ScheduleCollection;
