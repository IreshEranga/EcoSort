import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';

function WasteManagementPage() {
  const [binsData, setBinsData] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null); // State to track the hovered row

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
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Organic Bins</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Paper Bins</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Plastic Bins</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Electric Bins</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Other Bins</th>
            </tr>
          </thead>
          <tbody>
            {binsData.map((user, index) => {
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
                <tr
                  key={user.userId}
                  onMouseEnter={() => setHoveredRow(index)} // Set hovered row on mouse enter
                  onMouseLeave={() => setHoveredRow(null)} // Reset hovered row on mouse leave
                  style={{
                    backgroundColor: hoveredRow === index ? '#f1f1f1' : 'white', // Change background on hover
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.userId}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Organic.length > 0 ? binsMap.Organic.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Paper.length > 0 ? binsMap.Paper.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Plastic.length > 0 ? binsMap.Plastic.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Electric.length > 0 ? binsMap.Electric.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Other.length > 0 ? binsMap.Other.map(formatBinDetails) : 'N/A'}</td>
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
