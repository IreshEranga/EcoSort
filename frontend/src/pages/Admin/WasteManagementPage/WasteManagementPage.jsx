import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';

function WasteManagementPage() {
  const [binsData, setBinsData] = useState([]);

  // Fetch bins data from the API
  useEffect(() => {
    const fetchBinsData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/bins/bins/all');
        setBinsData(response.data);
      } catch (error) {
        console.error('Error fetching bins data:', error);
      }
    };

    fetchBinsData();
  }, []);

  return (
    <div className='admin-dashboard'>
      <AdminSidebar />
      <div className="main-content">
        <h1>Waste Management</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Bin ID</th>
              <th>Type</th>
              <th>Percentage</th>
              <th>QR Code</th>
            </tr>
          </thead>
          <tbody>
            {binsData.map(user => 
              user.bins.map(bin => (
                <tr key={bin.binId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{bin.binId}</td>
                  <td>{bin.type}</td>
                  <td>{bin.percentage}%</td>
                  <td>
                    <img src={bin.qr} alt={`QR code for bin ${bin.binId}`} style={{ width: '50px', height: '50px' }} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WasteManagementPage;
