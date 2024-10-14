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

  // Function to format bin details
  const formatBinDetails = (bin) => {
    return (
      <div>
        <div>Bin ID: {bin.binId}</div>
        <div>Percentage: {bin.percentage}%</div>
        {bin.qr && (
          <img src={bin.qr} alt={`QR code for bin ${bin.binId}`} style={{ width: '50px', height: '50px' }} />
        )}
      </div>
    );
  };

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
              <th>Organic Bins</th>
              <th>Paper Bins</th>
              <th>Plastic Bins</th>
              <th>Electric Bins</th>
              <th>Other Bins</th>
            </tr>
          </thead>
          <tbody>
            {binsData.map(user => {
              // Initialize bins details
              const binsMap = {
                Organic: [],
                Paper: [],
                Plastic: [],
                Electric: [],
                Other: [],
              };

              // Fill the binsMap based on user's bins
              user.bins.forEach(bin => {
                binsMap[bin.type].push({ binId: bin.binId, percentage: bin.percentage, qr: bin.qr });
              });

              return (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{binsMap.Organic.length > 0 ? binsMap.Organic.map(formatBinDetails) : 'N/A'}</td>
                  <td>{binsMap.Paper.length > 0 ? binsMap.Paper.map(formatBinDetails) : 'N/A'}</td>
                  <td>{binsMap.Plastic.length > 0 ? binsMap.Plastic.map(formatBinDetails) : 'N/A'}</td>
                  <td>{binsMap.Electric.length > 0 ? binsMap.Electric.map(formatBinDetails) : 'N/A'}</td>
                  <td>{binsMap.Other.length > 0 ? binsMap.Other.map(formatBinDetails) : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WasteManagementPage;
