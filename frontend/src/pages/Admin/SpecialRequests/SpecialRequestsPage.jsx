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
        const currentRequests = response.data;
        setSpecialRequests(currentRequests);
        setFilteredRequests(currentRequests);
      } catch (error) {
        console.error('Error fetching special requests:', error);
      }
    };

    const fetchPastRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests/past');
        // Filter for requests where collectStatus is 'Completed'
        const pastRequests = response.data.filter(request => 
          request.collectStatus === 'Completed'
        );
        setPastRequests(pastRequests);
        setFilteredPastRequests(pastRequests);
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
      request.requestId.toString (). includes ( searchQuery ) ||
      `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(searchQuery) ||
      request.wasteType.toLowerCase().includes(searchQuery) ||
      request.collectStatus.toLowerCase().includes(searchQuery) // Search based on collectStatus
    );
    setFilteredRequests(filtered);

    const filteredPast = pastRequests.filter(request =>
      request.collectStatus === 'Completed' && // Ensure only past requests with collectStatus 'Completed'
      (
        request.user.userId.toString().includes(searchQuery) ||
        request.requestId.toString (). includes ( searchQuery ) ||
        `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(searchQuery) ||
        request.wasteType.toLowerCase().includes(searchQuery) ||
        request.collectStatus.toLowerCase().includes(searchQuery) // Search based on collectStatus
      )
    );
    setFilteredPastRequests(filteredPast);
  }, [searchQuery, specialRequests, pastRequests]); 

  const handleCalculateAmount = async (requestId, reqID,originalREQUESTID) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/special-requests/${requestId}/calculate`);
      setFilteredRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId ? { ...request, amount: response.data.amount } : request
        )
      );
      navigate(`/admindashboard/payments?requestId=${originalREQUESTID}`);
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
  
    // Calculate the center position
    const pageWidth = doc.internal.pageSize.width;
    const title = 'Current Special Requests Report';
    const textWidth = doc.getTextWidth(title);
    const xPos = (pageWidth - textWidth) / 2;
  
    // Title (centered)
    doc.text(title, xPos, 20);
  
    // Table with header
    autoTable(doc, {
      head: [['User ID', 'User Name', 'Waste Type', 'Quantity (kg)', 'Description', 'Status', 'Amount (Rs.)', 'Payment Status', 'Collect Status']],
      body: filteredRequests.map(request => [
        request.user.userId,
        `${request.user.firstName} ${request.user.lastName}`,
        request.wasteType,
        request.quantity,
        request.description,
        request.status,
        `${request.amount}`,
        request.paymentStatus,
        request.collectStatus,
      ]),
      margin: { top: 30 },
      didDrawPage: (data) => {
        // Add header for each page
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text('EcoSort Waste Management - Current Special Requests', data.settings.margin.left, 10);
      },
    });
  
    // Add footer at the bottom of the page
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`EcoSort_Waste_Management`, 14, doc.internal.pageSize.height - 10); // Footer on the left bottom
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10); // Page numbers on the right bottom
    }
  
    // Save the PDF
    doc.save('Current_Special_Requests_Report.pdf');
  };  
  
  const downloadPastReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
  
    // Calculate the center position for the title
    const pageWidth = doc.internal.pageSize.width;
    const title = 'Past Special Requests Report';
    const textWidth = doc.getTextWidth(title);
    const xPos = (pageWidth - textWidth) / 2;
  
    // Title (centered)
    doc.text(title, xPos, 20);
  
    // Table with header
    autoTable(doc, {
      head: [['User ID', 'User Name', 'Waste Type', 'Quantity (kg)', 'Description', 'Amount (Rs.)', 'Collect Status']],
      body: filteredPastRequests.map(request => [
        request.user.userId,
        `${request.user.firstName} ${request.user.lastName}`,
        request.wasteType,
        request.quantity,
        request.description,
        `${request.amount}`,
        request.collectStatus,
      ]),
      margin: { top: 30 },
      didDrawPage: (data) => {
        // Add header for each page
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text('EcoSort Waste Management - Past Special Requests', data.settings.margin.left, 10);
      },
    });
  
    // Add footer at the bottom of the page
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`EcoSort_Waste_Management`, 14, doc.internal.pageSize.height - 10); // Footer on the left bottom
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10); // Page numbers on the right bottom
    }
  
    // Save the PDF
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
      setSelectedRequest(request);
      console.log("Selected reqest ",request) // Set the selected request for which driver is to be assigned
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
            placeholder="Search by Request ID, User ID, Name or Waste Type"
            style={{ padding: '8px', width: '500px', borderRadius: '10px' }}
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
              {['Request ID', 'User ID', 'User Name', 'Location', 'Waste Type', 'Quantity (kg)', 'Description', 'Action', 'Status', 'Payment Action', 'Amount (Rs.)', 'Payment Status', 'Driver'].map(header => (
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
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>   
                  <button 
                    onClick={() => handleUpdateStatus(request._id)}  
                    disabled={request.status === 'Accepted'} 
                    style={{ borderRadius: '10px', width: '85px', backgroundColor: (request.status === 'Accepted') ? '#ccc' : '#4CAF50', color: 'white' }} 
                  >
                    {request.status === 'Accepted' ? 'Accepted' : 'Accept'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{request.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button
                    disabled={request.paymentStatus === 'Done' || request.status === 'Pending' || request.amount !== 0} // Added condition for amount !== 0
                    onClick={() => handleCalculateAmount(request._id,request.user.userId,request.requestId)} 
                    style={{ borderRadius: '10px', width:'90px', backgroundColor: ( request . paymentStatus === 'Done' || request . status === 'Pending' || request . amount !== 0 ) ? '#ccc' : '#00BFFF', color: 'white' }}>
                      {request.paymentStatus === 'Done' || request.status === 'Pending' || request.amount !== 0 ? 'Calculated' : 'Calculate'}
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{request.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.paymentStatus}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <button 
                    onClick={() => handleAssignDriver(request)}  
                    disabled={request.status === 'Pending' || request.paymentStatus === 'Pending' || request.collectStatus !== 'Not Complete'}
                    style={{borderRadius:'10px', width:'70px', backgroundColor: (request.status === 'Pending' || request.paymentStatus === 'Pending' || request.collectStatus !== 'Not Complete') ? '#ccc' : '#00BFFF', color: 'white', width:'80px'}}
                  >
                    {/* {request.collectStatus === 'Assigned' ? 'Assigned' : 'Assign Driver'} */}
                    {request.collectStatus === 'Assigned' && request.assignedDriver ? request.assignedDriver.name : 'Assign Driver'}
                  </button>
                </td>
              {/* <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                {request.assignedDriver ? (
                  <span>{`${request.assignedDriver.name}`}</span>
                ) : (
                  <button 
                    onClick={() => handleAssignDriver(request)}  
                    disabled={request.paymentStatus === 'Pending' || request.collectStatus !== 'Not Complete'}
                    style={{
                      borderRadius: '10px', 
                      width: '70px', 
                      backgroundColor: (request.paymentStatus === 'Pending' || request.collectStatus !== 'Not Complete') ? '#ccc' : '#00BFFF', 
                      color: 'white'
                    }}
                  >
                    Assign Driver
                  </button>
                )}
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Past Requests Table */}
        <h2>Past Special Requests</h2>
        <table className='special-requests-table' style={{ width: '100%', margin: '0 auto', borderCollapse: 'collapse', fontSize: '14px', marginTop: '20px' }}>
          <thead>
            <tr>
              {[ 'Request ID' , 'User ID' , 'User Name' , 'Waste Type' , 'Quantity (kg)' , 'Description' , 'Amount (Rs)' , 'Driver' , 'Collect Status' ,] . map ( header => ( 
                < th key = { header } style = { { border: '1px solid #ddd' , padding: '6px' } } > { header } </ th >    
              )) }
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
                {/*<td style={{ border: '1px solid #ddd', padding: '6px' }}>{new Date(request.date).toLocaleDateString()}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>{request.time}</td>*/}
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{request.amount}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>{request.assignedDriver.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center', }}>{request.collectStatus}</td>
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