import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';

function WasteManagementPage() {
  const [bins, setBins] = useState([]); // State to hold the bin data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/bins/bins/all');
        setBins(response.data); // Set the bin data from the response
      } catch (err) {
        setError('Error fetching bin data'); // Handle errors
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchBins();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>; // Display loading message
  }

  if (error) {
    return <div>{error}</div>; // Display error message if any
  }

  return (
    <div className='admin-dashboard'>
      <AdminSidebar />
      <div className="main-content">
        <h1>Waste Management Bins</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Bin ID</th>
              <th>QR Code</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {bins.map((bin) => (
              <tr key={bin.binId}>
                <td>{bin.userId}</td>
                <td>{bin.name}</td>
                <td>{bin.binId}</td>
                <td>
                  <img src={bin.qr} alt={`QR Code for ${bin.binId}`} style={{ width: '100px' }} />
                </td>
                <td>{bin.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WasteManagementPage;
