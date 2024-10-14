import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './WasteManagementPage.css'; // Custom styles

function WasteManagementPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [bins, setBins] = useState({}); // Store bins by user ID

  // Fetch users and their bins
  useEffect(() => {
    const fetchUsersAndBins = async () => {
      try {
        // Fetch all users
        const usersResponse = await axios.get('http://localhost:8000/api/users');
        const fetchedUsers = usersResponse.data;
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers); // Set filtered users to initially all users

        // Fetch bins for each user using their userId
        const binsData = {};
        await Promise.all(fetchedUsers.map(async (user) => {
          const binsResponse = await axios.get(`http://localhost:8000/api/bins/user/${user._id}`); // Fetch using userId
          binsData[user._id] = binsResponse.data; // Store bins by userId
        }));
        setBins(binsData); // Set bins for all users
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUsersAndBins();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(value) ||
      user.lastName.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  // Handle PDF Report Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Waste Bin Report', 14, 20);

    const headers = ['User ID', 'User Name', 'Location', 'Organic Bin', 'Plastic Bin', 'Paper Bin', 'Electric Bin', 'Other Bin'];
    const data = filteredUsers.flatMap(user => {
      const userBins = bins[user._id] || [];
      const binDetails = {
        organic: userBins.find(bin => bin.type === 'Organic'),
        plastic: userBins.find(bin => bin.type === 'Plastic'),
        paper: userBins.find(bin => bin.type === 'Paper'),
        electric: userBins.find(bin => bin.type === 'Electric'),
        other: userBins.find(bin => bin.type === 'Other'),
      };

      return [
        [
          user._id,
          `${user.firstName} ${user.lastName}`,
          user.location ? `${user.location.latitude}, ${user.location.longitude}` : 'Location not available',
          binDetails.organic ? `${binDetails.organic.binId}, ${binDetails.organic.percentage}%, ${binDetails.organic.qrCode}` : 'N/A',
          binDetails.plastic ? `${binDetails.plastic.binId}, ${binDetails.plastic.percentage}%, ${binDetails.plastic.qrCode}` : 'N/A',
          binDetails.paper ? `${binDetails.paper.binId}, ${binDetails.paper.percentage}%, ${binDetails.paper.qrCode}` : 'N/A',
          binDetails.electric ? `${binDetails.electric.binId}, ${binDetails.electric.percentage}%, ${binDetails.electric.qrCode}` : 'N/A',
          binDetails.other ? `${binDetails.other.binId}, ${binDetails.other.percentage}%, ${binDetails.other.qrCode}` : 'N/A',
        ],
      ];
    });

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    doc.save('waste_bin_report.pdf');
  };

  // Function to handle map navigation
  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> {/* Sidebar component */}
      
      <div className="main-content">
        <h1 className="topic" style={{ color: 'black' }}>Waste Management</h1>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            type="text"
            placeholder="Search by user name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          
          {filteredUsers.length > 0 && (
            <div className="report-section">
              <button className="btn btn-primary" onClick={generatePDF}>
                Download PDF Report
              </button>
            </div>
          )}
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Location</th>
              <th>Organic Bin</th>
              <th>Plastic Bin</th>
              <th>Paper Bin</th>
              <th>Electric Bin</th>
              <th>Other Bin</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.userId}</td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>
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
                  <td>
                    {bins[user._id] ? (
                      <div>
                        {bins[user._id].find(bin => bin.type === 'Organic') ? (
                          <>
                            <p>Bin ID: {bins[user._id].find(bin => bin.type === 'Organic').binId}</p>
                            <p>QR Code: <img src={bins[user._id].find(bin => bin.type === 'Organic').qrCode} alt="QR Code" className="qr-code-image" /></p>
                            <p>Percentage: {bins[user._id].find(bin => bin.type === 'Organic').percentage}%</p>
                          </>
                        ) : 'N/A'}
                      </div>
                    ) : 'No bins available'}
                  </td>
                  <td>
                    {bins[user._id] ? (
                      <div>
                        {bins[user._id].find(bin => bin.type === 'Plastic') ? (
                          <>
                            <p>Bin ID: {bins[user._id].find(bin => bin.type === 'Plastic').binId}</p>
                            <p>QR Code: <img src={bins[user._id].find(bin => bin.type === 'Plastic').qrCode} alt="QR Code" className="qr-code-image" /></p>
                            <p>Percentage: {bins[user._id].find(bin => bin.type === 'Plastic').percentage}%</p>
                          </>
                        ) : 'N/A'}
                      </div>
                    ) : 'No bins available'}
                  </td>
                  <td>
                    {bins[user._id] ? (
                      <div>
                        {bins[user._id].find(bin => bin.type === 'Paper') ? (
                          <>
                            <p>Bin ID: {bins[user._id].find(bin => bin.type === 'Paper').binId}</p>
                            <p>QR Code: <img src={bins[user._id].find(bin => bin.type === 'Paper').qrCode} alt="QR Code" className="qr-code-image" /></p>
                            <p>Percentage: {bins[user._id].find(bin => bin.type === 'Paper').percentage}%</p>
                          </>
                        ) : 'N/A'}
                      </div>
                    ) : 'No bins available'}
                  </td>
                  <td>
                    {bins[user._id] ? (
                      <div>
                        {bins[user._id].find(bin => bin.type === 'Electric') ? (
                          <>
                            <p>Bin ID: {bins[user._id].find(bin => bin.type === 'Electric').binId}</p>
                            <p>QR Code: <img src={bins[user._id].find(bin => bin.type === 'Electric').qrCode} alt="QR Code" className="qr-code-image" /></p>
                            <p>Percentage: {bins[user._id].find(bin => bin.type === 'Electric').percentage}%</p>
                          </>
                        ) : 'N/A'}
                      </div>
                    ) : 'No bins available'}
                  </td>
                  <td>
                    {bins[user._id] ? (
                      <div>
                        {bins[user._id].find(bin => bin.type === 'Other') ? (
                          <>
                            <p>Bin ID: {bins[user._id].find(bin => bin.type === 'Other').binId}</p>
                            <p>QR Code: <img src={bins[user._id].find(bin => bin.type === 'Other').qrCode} alt="QR Code" className="qr-code-image" /></p>
                            <p>Percentage: {bins[user._id].find(bin => bin.type === 'Other').percentage}%</p>
                          </>
                        ) : 'N/A'}
                      </div>
                    ) : 'No bins available'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WasteManagementPage;