import React, { useEffect, useState } from 'react';   
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function SpecialRequestsPage() {
  const [specialRequests, setSpecialRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        setSpecialRequests(response.data);
        setFilteredRequests(response.data);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    fetchSpecialRequests();
  }, []);

  useEffect(() => {
    // Filter requests based on the search query
    const filtered = specialRequests.filter(request =>
      request.user.userId.toString().includes(searchQuery) ||
      `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(searchQuery) ||
      request.wasteType.toLowerCase().includes(searchQuery) ||
      new Date(request.date).toLocaleDateString().toLowerCase().includes(searchQuery)
    );
    setFilteredRequests(filtered);
  }, [searchQuery, specialRequests]);

  const handleCalculateAmount = async (requestId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/special-requests/${requestId}/calculate`);
      setFilteredRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, amount: response.data.amount } : request
        )
      );
    } catch (error) {
      console.error('Error calculating amount:', error);
    }
  };

  const handleUpdateStatus = async (requestId) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/special-requests/${requestId}/`, { status: 'Accepted' });
      setFilteredRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, status: response.data.status } : request
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Special Requests Report', 14, 20);

    autoTable(doc, {
      head: [['User ID', 'User Name', 'Waste Type', 'Quantity', 'Description', 'Date', 'Time', 'Status', 'Amount']],
      body: filteredRequests.map(request => [
        request.user.userId,
        `${request.user.firstName} ${request.user.lastName}`,
        request.wasteType,
        request.quantity,
        request.description,
        new Date(request.date).toLocaleDateString(),
        request.time,
        request.status,
        `$${request.amount}`
      ])
    });

    doc.save('Special_Requests_Report.pdf');
  };

  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className='admin-dashboard'>
      <AdminSidebar />
      <div className="main-content" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Special Requests</h1>

        <div style={{ marginTop: '30px', marginBottom: '40px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            placeholder="Search by User ID, Name, Waste Type, or Date"
            style={{ padding: '8px', width: '600px', borderRadius: '10px' }}
          />
          <button onClick={downloadReport} style={{ marginLeft: '10px', padding: '8px', borderRadius: '10px' }}>
            Download Report
          </button>
        </div>

        <table className='special-requests-table' style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              {['User ID', 'User Name', 'Location', 'Waste Type', 'Quantity', 'Description', 'Date', 'Time', 'Status', 'Action', 'Amount', 'Action'].map(header => (
                <th key={header} style={{ border: '1px solid #ddd', padding: '6px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request._id}>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.user.userId}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{`${request.user.firstName} ${request.user.lastName}`}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  {request.user.location ? (
                    <button 
                      className="map-button" 
                      onClick={() => handleNavigateToMap(request.user.location.latitude, request.user.location.longitude)}
                      style={{width:'75px'}}
                    >
                      View on Map
                    </button>
                  ) : (
                    'Location not available'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.wasteType}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', width:'80px' }}>{request.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', width: '300px' }}>{request.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{new Date(request.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.time}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(request._id)} 
                    disabled={request.status === 'Accepted'}
                    style={{borderRadius:'10px', width:'85px', backgroundColor: request.status === 'Accepted' ? '#ccc' : '#4CAF50', color: 'white'}}
                  >
                    {request.status === 'Accepted' ? 'Accepted' : 'Accept'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>${request.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button onClick={() => handleCalculateAmount(request._id)} style={{borderRadius:'10px'}}>Calculate Amount</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SpecialRequestsPage;