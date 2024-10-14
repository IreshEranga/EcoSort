import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './WasteManagementPage.css'; // Add CSS if needed
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function WasteManagementPage() {
  const [binsData, setBinsData] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch bins data from the API
  useEffect(() => {
    const fetchBinsData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/bins/bins/all');
        setBinsData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching bins data:', error);
      }
    };

    fetchBinsData();
  }, []);

  // Function to format bin details
  const formatBinDetails = (bin) => (
    <div>
      <div>Bin ID: {bin.binId}</div>
      <div>Percentage: {bin.percentage}%</div>
      {bin.qr && (
        <img src={bin.qr} alt={`QR code for bin ${bin.binId}`} style={{ width: '50px', height: '50px' }} />
      )}
    </div>
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter data based on search query
    const filtered = binsData.filter(user => (
      user.userId.toString().includes(query) ||
      user.bins.some(bin =>
        bin.binId.toString().includes(query) ||
        bin.type.toLowerCase().includes(query)
      )
    ));
    setFilteredData(filtered);
  };

  // Download report based on filtered data
  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Waste Management Report', 14, 20);

    // Prepare data for the table
    const reportData = filteredData.map(user => ({
      userId: user.userId,
      name: user.name,
      bins: user.bins.map(bin => `${bin.binId} (${bin.type}): ${bin.percentage}%`).join(', '),
    }));

    // Create the table
    doc.autoTable({
      head: [['User ID', 'Name', 'Bins']],
      body: reportData.map(item => [item.userId, item.name, item.bins]),
    });

    // Save the PDF
    doc.save('Waste_Management_Report.pdf');
  };

  // Function to handle map navigation
  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className='admin-dashboard'>
      <AdminSidebar />
      <div className="main-content">
        <h1>Waste Management</h1>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by User ID, Bin ID, or Bin Type"
            style={{ padding: '8px', width: '300px' }}
          />
          <button onClick={downloadReport} style={{ marginLeft: '10px', padding: '8px' }}>
            Download Report
          </button>
        </div>
        <br />

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>User ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Location</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Organic Bin</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Paper Bin</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Plastic Bin</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Electronic Bin</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Other Bin</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => {
              // Initialize bins details
              const binsMap = {
                Organic: [],
                Paper: [],
                Plastic: [],
                Electronic: [],
                Other: [],
              };

              // Fill the binsMap based on user's bins
              user.bins.forEach(bin => {
                binsMap[bin.type].push({ binId: bin.binId, percentage: bin.percentage, qr: bin.qr });
              });

              return (
                <tr
                  key={user.userId}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    backgroundColor: hoveredRow === index ? '#f1f1f1' : 'white',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.userId}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {user.location && user.location.latitude && user.location.longitude ? (
                      <button 
                        className="map-button" 
                        onClick={() => handleNavigateToMap(user.location.latitude, user.location.longitude)}
                      >
                        View on Map
                      </button>
                    ) : (
                      'Location not available'
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Organic.length > 0 ? binsMap.Organic.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Paper.length > 0 ? binsMap.Paper.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Plastic.length > 0 ? binsMap.Plastic.map(formatBinDetails) : 'N/A'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{binsMap.Electronic.length > 0 ? binsMap.Electronic.map(formatBinDetails) : 'N/A'}</td>
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