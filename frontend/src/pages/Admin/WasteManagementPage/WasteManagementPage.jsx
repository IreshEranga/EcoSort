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
          const binsResponse = await axios.get(`http://localhost:8000/api/bins/user/${user.userId}`);
          binsData[user.userId] = binsResponse.data;
        }));
        setBins(binsData);
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

    const headers = ['User ID', 'User Name', 'Organic', 'Paper', 'Plastic', 'Electric', 'Other'];
    const data = filteredUsers.flatMap(user => {
      const userBins = bins[user.userId] || [];
      const binDetails = { Organic: 'N/A', Paper: 'N/A', Plastic: 'N/A', Electric: 'N/A', Other: 'N/A' };

      userBins.forEach(bin => {
        if (bin.type === 'Organic') binDetails.Organic = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
        if (bin.type === 'Paper') binDetails.Paper = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
        if (bin.type === 'Plastic') binDetails.Plastic = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
        if (bin.type === 'Electric') binDetails.Electric = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
        if (bin.type === 'Other') binDetails.Other = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
      });

      return [
        user.userId,
        `${user.firstName} ${user.lastName}`,
        binDetails.Organic,
        binDetails.Paper,
        binDetails.Plastic,
        binDetails.Electric,
        binDetails.Other,
      ];
    });

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    doc.save('waste_bin_report.pdf');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

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
              <th>Organic</th>
              <th>Paper</th>
              <th>Plastic</th>
              <th>Electric</th>
              <th>Other</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                const userBins = bins[user.userId] || [];
                const binDetails = { Organic: 'N/A', Paper: 'N/A', Plastic: 'N/A', Electric: 'N/A', Other: 'N/A' };

                userBins.forEach(bin => {
                  if (bin.type === 'Organic') binDetails.Organic = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
                  if (bin.type === 'Paper') binDetails.Paper = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
                  if (bin.type === 'Plastic') binDetails.Plastic = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
                  if (bin.type === 'Electric') binDetails.Electric = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
                  if (bin.type === 'Other') binDetails.Other = `${bin._id}, ${bin.percentage}%, QR: ${bin.qrCode}`;
                });

                return (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>
                      {user.location && user.location.latitude && user.location.longitude ? (
                        <button
                          className="map-button"
                          onClick={() => window.open(`https://www.google.com/maps?q=${user.location.latitude},${user.location.longitude}`, '_blank')}
                        >
                          View on Map
                        </button>
                      ) : (
                        'Location not available'
                      )}
                    </td>
                    <td>{binDetails.Organic}</td>
                    <td>{binDetails.Paper}</td>
                    <td>{binDetails.Plastic}</td>
                    <td>{binDetails.Electric}</td>
                    <td>{binDetails.Other}</td>
                  </tr>
                );
              })
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