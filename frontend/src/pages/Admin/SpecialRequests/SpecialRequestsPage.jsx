import React, { useEffect, useState } from 'react';    
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { useNavigate } from 'react-router-dom';

import AssignDriverModal from './AssignDriverModal';

function SpecialRequestsPage() {
  const [specialRequests, setSpecialRequests] = useState([]);
  const [pastRequests, setPastRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filteredPastRequests, setFilteredPastRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecialRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests');
        const currentRequests = response.data.filter(request => new Date(request.date) >= new Date());
        setSpecialRequests(currentRequests);
        setFilteredRequests(currentRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    const fetchPastRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests/past');
        setPastRequests(response.data);
        setFilteredPastRequests(response.data);
      } catch (error) {
        console.error('Error fetching past special requests:', error);
      }
    };

    fetchSpecialRequests();
    fetchPastRequests();
  }, []);

  useEffect(() => {
    const filtered = specialRequests.filter(request =>
      request.user.userId.toString().includes(searchQuery) ||
      `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(searchQuery) ||
      request.wasteType.toLowerCase().includes(searchQuery) ||
      new Date(request.date).toLocaleDateString().toLowerCase().includes(searchQuery)
    );
    setFilteredRequests(filtered);

    const filteredPast = pastRequests.filter(request =>
      request.user.userId.toString().includes(searchQuery) ||
      `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(searchQuery) ||
      request.wasteType.toLowerCase().includes(searchQuery) ||
      new Date(request.date).toLocaleDateString().toLowerCase().includes(searchQuery)
    );
    setFilteredPastRequests(filteredPast);
  }, [searchQuery, specialRequests, pastRequests]);

  const handleCalculateAmount = async (requestId, reqID) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/special-requests/${requestId}/calculate`);
      setFilteredRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, amount: response.data.amount } : request
        )
      );
      navigate(`/admindashboard/payments?requestId=${reqID}`);
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

  const downloadCurrentReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Current Special Requests Report', 14, 20);

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
        `$${request.amount}`
      ])
    });

    doc.save('Current_Special_Requests_Report.pdf');
  };

  const downloadPastReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text('Past Special Requests Report', 14, 20);

    autoTable(doc, {
      head: [['User ID', 'User Name', 'Waste Type', 'Quantity', 'Description', 'Date', 'Time', 'Status', 'Amount']],
      body: filteredPastRequests.map(request => [
        request.user.userId,
        `${request.user.firstName} ${request.user.lastName}`,
        request.wasteType,
        request.quantity,
        request.description,
        new Date(request.date).toLocaleDateString(),
        request.time,
        `$${request.amount}`
      ])
    });

    doc.save('Past_Special_Requests_Report.pdf');
  };

  const handleNavigateToMap = (latitude, longitude) => {
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(mapUrl, '_blank');
  };

  const handleAssignDriver = async (request) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/driver/drivers/available/${request.user.city}`);
      console.log(request.user.city);
      setAvailableDrivers(response.data); // Set the available drivers for the modal
      setSelectedRequest(request); // Set the selected request for which driver is to be assigned
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error('Error fetching available drivers:', error);
    }
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
            style={{ padding: '8px', width: '400px', borderRadius: '10px' }}
          />
          <button onClick={downloadCurrentReport} style={{ marginLeft: '20px', padding: '8px', borderRadius: '10px' }}>
            Download Current Report
          </button>
          <button onClick={downloadPastReport} style={{ marginLeft: '10px', padding: '8px', borderRadius: '10px' }}>
            Download Past Report
          </button>
        </div>

        {/* Current Requests Table */}
        <h2>Current Special Requests</h2>
        <table className='special-requests-table' style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '20px', marginTop: '20px' }}>
          <thead>
            <tr>
              {['Request ID', 'User ID', 'User Name', 'Location', 'Waste Type', 'Quantity', 'Description', 'Date', 'Time', 'Payment Action', 'Amount', 'Payment Status', 'Status', 'Action', 'Driver'].map(header => (
                <th key={header} style={{ border: '1px solid #ddd', padding: '5px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(request => (
              <tr key={request._id}>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.requestId}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.user.userId}</td>
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
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.wasteType}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', width:'80px' }}>{request.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', width: '300px' }}>{request.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{new Date(request.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.time}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button
                    disabled={request.paymentStatus === 'Done'}
                    onClick={() => handleCalculateAmount(request._id,request.user.userId)} 
                    style={{ borderRadius: '10px', width:'90px', backgroundColor: (request.status === 'Done') ? '#ccc' : '#00BFFF', color: 'white' }}>
                      {request.paymentStatus === 'Done' ? 'Calculated' : 'Calculate'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>${request.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.paymentStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(request._id)} 
                    disabled={request.status === 'Accepted' || request.paymentStatus === 'Pending'} 
                    style={{borderRadius:'10px', width:'85px', backgroundColor: (request.status === 'Accepted' || request.paymentStatus === 'Pending') ? '#ccc' : '#4CAF50', color: 'white'}}
                  >
                    {request.status === 'Accepted' ? 'Accepted' : 'Accept'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button 
                    onClick={() => handleAssignDriver(request)}  
                    disabled={request.status === 'Pending'}
                    style={{borderRadius:'10px', width:'70px', backgroundColor: (request.status === 'Pending') ? '#ccc' : '#00BFFF', color: 'white'}}
                  >
                    {request.status === 'Assigned' ? 'Assigned' : 'Assign Driver'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Past Requests Table */}
        <h2>Past Special Requests</h2>
        <table className='special-requests-table' style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '14px', marginTop: '20px' }}>
          <thead>
            <tr>
              {['Request ID', 'User ID', 'User Name', 'Waste Type', 'Quantity', 'Description', 'Date', 'Time', 'Collection Status', 'Amount'].map(header => (
                <th key={header} style={{ border: '1px solid #ddd', padding: '6px' }}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPastRequests.map(request => (
              <tr key={request._id}>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.requestId}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.user.userId}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{`${request.user.firstName} ${request.user.lastName}`}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.wasteType}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', width:'80px' }}>{request.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', width: '300px' }}>{request.description}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{new Date(request.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.time}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.collectStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>${request.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Assign Driver Modal */}
        <AssignDriverModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          drivers={availableDrivers}
        />
      </div>
    </div>
  );
}

export default SpecialRequestsPage;
