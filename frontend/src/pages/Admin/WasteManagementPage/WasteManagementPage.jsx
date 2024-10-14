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
              <th>Bin ID (Organic)</th>
              <th>Percentage (Organic)</th>
              <th>QR Code (Organic)</th>
              <th>Bin ID (Paper)</th>
              <th>Percentage (Paper)</th>
              <th>QR Code (Paper)</th>
              <th>Bin ID (Plastic)</th>
              <th>Percentage (Plastic)</th>
              <th>QR Code (Plastic)</th>
              <th>Bin ID (Electric)</th>
              <th>Percentage (Electric)</th>
              <th>QR Code (Electric)</th>
              <th>Bin ID (Other)</th>
              <th>Percentage (Other)</th>
              <th>QR Code (Other)</th>
            </tr>
          </thead>
          <tbody>
            {binsData.map(user => {
              // Initialize bins details
              const binsMap = {
                Organic: { binId: '', percentage: '', qr: '' },
                Paper: { binId: '', percentage: '', qr: '' },
                Plastic: { binId: '', percentage: '', qr: '' },
                Electric: { binId: '', percentage: '', qr: '' },
                Other: { binId: '', percentage: '', qr: '' },
              };

              // Fill the binsMap based on user's bins
              user.bins.forEach(bin => {
                binsMap[bin.type] = { binId: bin.binId, percentage: bin.percentage, qr: bin.qr };
              });

              return (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name}</td>
                  <td>{binsMap.Organic.binId}</td>
                  <td>{binsMap.Organic.percentage}%</td>
                  <td>
                    {binsMap.Organic.qr && (
                      <img src={binsMap.Organic.qr} alt={`QR code for bin ${binsMap.Organic.binId}`} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>{binsMap.Paper.binId}</td>
                  <td>{binsMap.Paper.percentage}%</td>
                  <td>
                    {binsMap.Paper.qr && (
                      <img src={binsMap.Paper.qr} alt={`QR code for bin ${binsMap.Paper.binId}`} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>{binsMap.Plastic.binId}</td>
                  <td>{binsMap.Plastic.percentage}%</td>
                  <td>
                    {binsMap.Plastic.qr && (
                      <img src={binsMap.Plastic.qr} alt={`QR code for bin ${binsMap.Plastic.binId}`} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>{binsMap.Electric.binId}</td>
                  <td>{binsMap.Electric.percentage}%</td>
                  <td>
                    {binsMap.Electric.qr && (
                      <img src={binsMap.Electric.qr} alt={`QR code for bin ${binsMap.Electric.binId}`} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
                  <td>{binsMap.Other.binId}</td>
                  <td>{binsMap.Other.percentage}%</td>
                  <td>
                    {binsMap.Other.qr && (
                      <img src={binsMap.Other.qr} alt={`QR code for bin ${binsMap.Other.binId}`} style={{ width: '50px', height: '50px' }} />
                    )}
                  </td>
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
