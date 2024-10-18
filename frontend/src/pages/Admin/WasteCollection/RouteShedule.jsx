import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './RouteShedule.css';
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import 'jspdf-autotable'; // Import autoTable for table generation
import { ClipLoader } from 'react-spinners';

function RouteShedule() {
  
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); 
  const [groupedUsers, setGroupedUsers] = useState({}); 
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState(""); // Add search term state
  const [isLoading, setIsLoading] = useState(false); 


  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch users and bins from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/bins/bins/all');
        const data = await response.json();
        setUsers(data); 
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching users with bins:', error);
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Group users by city with today's waste collection date
  useEffect(() => {
    const today = formatDate(currentDateTime).toLowerCase(); 
    const filteredUsers = users.filter(user => 
      user.wasteCollectionDate && user.wasteCollectionDate.toLowerCase() === today
    );

    const grouped = filteredUsers.reduce((acc, user) => {
      acc[user.city] = acc[user.city] || [];
      acc[user.city].push(user);
      return acc;
    }, {});

    setGroupedUsers(grouped); 
  }, [users, currentDateTime]);

  // Format the current date and time
  const formatDate = (date) => {
    const options = { weekday: 'long' }; 
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString();
  };

  // Handle button clicks for navigation
  const handleNavigation = () => {
    navigate('/admindashboard/collection-routine/dateShedule');
  };

  const handleNavigationRoutes = () => {
    navigate('/admindashboard/displayRoutes');
  };

  // Filter users based on search term
  const filteredGroupedUsers = Object.entries(groupedUsers).map(([city, users]) => [
    city,
    users.filter(user =>
      user.userID ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.city.toLowerCase().includes(searchTerm.toLowerCase()) 
    ),
  ]);

  /*

const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // Add title and basic styling
  doc.setFontSize(18);
  doc.text('User Schedule', 14, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${formatDate(currentDateTime)}`, 14, 30);
  doc.text(`Time: ${formatTime(currentDateTime)}`, 14, 40);

  // Iterate through the cities and generate a table for each city
  filteredGroupedUsers.forEach(([city, users]) => {
    if (users.length > 0) {
      // Add city title
      doc.addPage(); // Start a new page for each city
      doc.setFontSize(16);
      doc.text(`City: ${city}`, 14, 20);

      // User Table Columns
      const userColumns = [
        { header: 'User ID', dataKey: 'userId' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Address', dataKey: 'address' },
      ];

      // Add user table to the PDF
      users.forEach((user, userIndex) => {
        const userData = [
          {
            userId: user.userId,
            name: user.name,
            email: user.email,
            address: user.address,
          },
        ];

        // Render user table
        doc.autoTable({
          head: [userColumns.map(col => col.header)], // Table headers
          body: userData.map(user => [user.userId, user.name, user.email, user.address]), // Table rows
          startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 30, // Positioning after previous table
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
        });

        // Bin Table Columns
        const binColumns = [
          { header: 'Bin ID', dataKey: 'binId' },
          { header: 'Type', dataKey: 'type' },
          { header: 'Percentage', dataKey: 'percentage' },
          { header: 'Status', dataKey: 'status' },
        ];

        // Map bin data for the table
        const binData = user.bins.map(bin => ({
          binId: bin.binId,
          type: bin.type,
          percentage: `${bin.percentage}%`,
          status: bin.status,
        }));

        // Render bin table inside the user row
        if (binData.length > 0) {
          doc.autoTable({
            head: [binColumns.map(col => col.header)], // Table headers for bins
            body: binData.map(bin => [bin.binId, bin.type, bin.percentage, bin.status]), // Table rows for bins
            startY: doc.autoTable.previous.finalY + 5, // Position right after the user table
            theme: 'grid',
            headStyles: { fillColor: [46, 204, 113] }, // Green header for the bin table
            styles: { fontSize: 10, cellPadding: 1 }, // Reduce font and padding for nested table
          });
        }
      });
    }
  });

  // Save the generated PDF
  doc.save('User_Schedule.pdf');
};*/



const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // Add title and basic styling
  doc.setFontSize(18);
  doc.text('User Schedule', 14, 20);
  doc.setFontSize(12);
  doc.text(`Date: ${formatDate(currentDateTime)}`, 14, 30);
  doc.text(`Time: ${formatTime(currentDateTime)}`, 14, 40);
  
  let currentY = 50; // Start Y position after the title

  // Iterate through the cities and generate a table for each city
  filteredGroupedUsers.forEach(([city, users], cityIndex) => {
    if (users.length > 0) {
      // Add city title
      doc.setFontSize(16);
      doc.text(`City: ${city}`, 14, currentY);
      currentY += 10; // Adjust Y position for the next table

      // User Table Columns
      const userColumns = [
        { header: 'User ID', dataKey: 'userId' },
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Address', dataKey: 'address' },
      ];

      // Render user table for each user
      users.forEach((user) => {
        const userData = [
          {
            userId: user.userId,
            name: user.name,
            email: user.email,
            address: user.address,
          },
        ];

        // Render user table
        doc.autoTable({
          head: [userColumns.map(col => col.header)], // Table headers
          body: userData.map(user => [user.userId, user.name, user.email, user.address]), // Table rows
          startY: currentY, // Use current Y position
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
        });

        currentY = doc.autoTable.previous.finalY + 5; // Update current Y position for the next element

        // Bin Table Columns
        const binColumns = [
          { header: 'Bin ID', dataKey: 'binId' },
          { header: 'Type', dataKey: 'type' },
          { header: 'Percentage', dataKey: 'percentage' },
          { header: 'Status', dataKey: 'status' },
        ];

        // Map bin data for the table
        const binData = user.bins.map(bin => ({
          binId: bin.binId,
          type: bin.type,
          percentage: `${bin.percentage}%`,
          status: bin.status,
        }));

        // Render bin table inside the user row
        if (binData.length > 0) {
          doc.autoTable({
            head: [binColumns.map(col => col.header)], // Table headers for bins
            body: binData.map(bin => [bin.binId, bin.type, bin.percentage, bin.status]), // Table rows for bins
            startY: currentY, // Use updated Y position
            theme: 'grid',
            headStyles: { fillColor: [46, 204, 113] }, // Green header for the bin table
            styles: { fontSize: 10, cellPadding: 1 }, // Reduce font and padding for nested table
          });
          
          currentY = doc.autoTable.previous.finalY + 10; // Update current Y position after bin table
        }
      });

      currentY += 10; // Extra space after each city's tables
    }
  });

  // Save the generated PDF
  doc.save('User_Schedule.pdf');
};






  return (
    <div className="admin-dashboard">
      <AdminSidebar /> 

      <div className="main-content" style={{ backgroundColor: 'white', zIndex:1000 }}>
      <div className="date-time-container" style={dateTimeStyles}>
          {/* <div className="current-date" style={dateStyles}>{formatDate(currentDateTime)}</div> */}
          <div className="current-time" style={timeStyles}>{formatTime(currentDateTime)}</div>
        </div>

        

        <button onClick={handleNavigationRoutes} style={buttonStylesRoutes}>
          Routes
        </button>

        <button onClick={handleNavigation} style={buttonStyles}>
          Schedule Dates
        </button>
        <br />

        <h1 style={{ marginTop: '5px' }}>User Schedule For {formatDate(currentDateTime)}</h1>
        <hr style={{ color: 'green' }} />

        {/* Loading Animation */}
        {isLoading && (
          <div className="loading-spinner" style={{display:'flex',
            justifyContent:'center',
            alignItems:'center',
            height:'100vh'
          }}>
            <ClipLoader color="#00BFFF" loading={isLoading} size={100}  />
          </div>
        )}

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by user Id, name, email, city , address"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />

        {/* Download PDF Button */}
        <button onClick={handleDownloadPDF} style={pdfButtonStyle}>
          Download PDF
        </button>

        {/* Display Users and Their Bins Grouped by City */}
        <div>
          {filteredGroupedUsers.length > 0 ? (
            filteredGroupedUsers.map(([city, users]) => (
              users.length > 0 && (
                <div key={city}>
                  <h2>{city}</h2>
                  <table style={tableStyles}>
                    <thead>
                      <tr style={{border:'1px solid black'}}>
                        <th style={{border:'1px solid black'}}>User ID</th>
                        <th style={{border:'1px solid black'}}>Name</th>
                        <th style={{border:'1px solid black'}}>Email</th>
                        <th style={{border:'1px solid black'}}>Address</th>
                        <th style={{border:'1px solid black'}}>Bins</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user.userId} className={`table-row ${index % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                          <td style={{border:'1px solid black'}}>{user.userId}</td>
                          <td style={{border:'1px solid black'}}>{user.name}</td>
                          <td style={{border:'1px solid black'}}>{user.email}</td>
                          <td style={{border:'1px solid black'}}>{user.address}</td>
                          <td style={{border:'1px solid black'}}>
                            <table style={innerTableStyles}>
                              <thead>
                                <tr style={{border:'1px solid black'}}>
                                  <th style={{border:'1px solid black'}}>Bin ID</th>
                                  <th style={{border:'1px solid black'}}>Type</th>
                                  <th style={{border:'1px solid black'}}>Percentage</th>
                                  <th style={{border:'1px solid black'}}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {user.bins.map((bin, binIndex) => (
                                  <tr key={bin.binId} className={`table-row ${binIndex % 2 === 0 ? 'rowEven' : 'rowOdd'}`}>
                                    <td style={{border:'1px solid black'}}>{bin.binId}</td>
                                    <td style={{border:'1px solid black'}}>{bin.type}</td>
                                    <td style={{border:'1px solid black'}}>{bin.percentage}%</td>
                                    <td style={{border:'1px solid black'}}>{bin.status}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ))
          ) : (
            <p>No users scheduled for collection today.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// CSS styles
const buttonStyles = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const buttonStylesRoutes = {
  position: 'absolute',
  top: '20px',
  left: '300px',
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const dateTimeStyles = {
  marginTop: '-10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  
};

const dateStyles = {
  fontSize: '36px',
  fontWeight: 'bold',
  marginBottom: '5px',
};

const timeStyles = {
  fontSize: '24px',
  color:'blue'
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const innerTableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const searchInputStyle = {
  width: '400px',
  padding: '5px',
  marginBottom: '10px',
  borderRadius: '4px',
};

const pdfButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft:'50px',
  marginBottom: '10px',
};

export default RouteShedule;
