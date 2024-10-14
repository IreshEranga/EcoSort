import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../../components/NavbarComponent';
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import both toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete  } from 'react-icons/ai'; // Import close icon from react-icons


function WasteManagement() {
  //const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [user, setUser] = useState(null);
  const [binType, setBinType] = useState('');
  const [binPercentage, setBinPercentage] = useState('');
  const [error, setError] = useState('');
  const [showCreateBinForm, setShowCreateBinForm] = useState(false);
  const [editBin, setEditBin] = useState(null);
  // State for special requests
  const [specialRequests, setSpecialRequests] = useState([]);
  const [requestWasteType, setRequestWasteType] = useState('');
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchBins = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:8000/api/bins/user/${user._id}`);
          setBins(response.data);
        } catch (error) {
          console.error('Error fetching bins:', error);
        }
      }
    };

    fetchBins();
  }, [user]);

  const handleCreateBinSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isDuplicate = bins.some((bin) => bin.type === binType);
    if (isDuplicate) {
      setError('A bin of this type already exists.');
      return;
    }

    const userID = JSON.parse(localStorage.getItem('user'))._id;

    try {
      const response = await axios.post('http://localhost:8000/api/bins/', {
        user: userID,
        type: binType,
      });

      if (response.status === 201) {
        toast.success('Bin created successfully!'); // Show success toast
        setBinType('');
        setShowCreateBinForm(false);
        setError(''); // Reset error message

        const fetchBins = async () => {
          if (user) {
            const response = await axios.get(`http://localhost:8000/api/bins/user/${user._id}`);
            setBins(response.data);
          }
        };
        fetchBins();
      }
    } catch (err) {
      toast.error('Failed to create bin. Please try again.'); // Show error toast
      console.error(err);
    }
  };

  const handleEditBin = (bin) => {
    setEditBin(bin);
    setBinPercentage(bin.percentage);
    setError(''); // Reset error message
  };

  const handleUpdateBin = async (e) => {
    e.preventDefault();
    setError('');

    if (binPercentage < 0 || binPercentage > 100) {
      setError('Percentage must be between 0 and 100.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/bins/${editBin._id}`, {
        percentage: binPercentage,
      });

      if (response.status === 200) {
        toast.success('Bin updated successfully!'); // Show success toast
        setEditBin(null);
        setBinPercentage('');
        setError(''); // Reset error message

        const fetchBins = async () => {
          if (user) {
            const response = await axios.get(`http://localhost:8000/api/bins/user/${user._id}`);
            setBins(response.data);
          }
        };
        fetchBins();
      }
    } catch (err) {
      toast.error('Failed to update bin. Please try again.'); // Show error toast
      console.error(err);
    }
  };

  const handleDeleteBin = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/bins/${id}`);
      if (response.status === 204) {
        toast.success('Bin deleted successfully!'); // Show success toast
        const fetchBins = async () => {
          if (user) {
            const response = await axios.get(`http://localhost:8000/api/bins/user/${user._id}`);
            setBins(response.data);
          }
        };
        fetchBins();
      }
    } catch (err) {
      toast.error('Failed to delete bin. Please try again.'); // Show error toast
      console.error(err);
    }
  };

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequests = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:8000/api/special-requests/user/${user._id}`);
          setSpecialRequests(response.data);
        } catch (error) {
          console.error('Error fetching special requests:', error);
        }
      }
    };

    fetchSpecialRequests();
  }, [user]);

  // Handle create special request
  const handleCreateRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/special-requests', {
        user: user._id,
        wasteType: requestWasteType,
        quantity: requestQuantity,
        description: requestDescription,
        date: requestDate,
        time: requestTime,
      });

      if (response.status === 201) {
        toast.success('Special request created successfully!'); 
        setRequestWasteType('');
        setRequestQuantity('');
        setRequestDescription('');
        setRequestDate('');
        setRequestTime('');
        setShowCreateRequestForm(false);
        
        // Fetch updated special requests
        const fetchSpecialRequests = async () => {
          const response = await axios.get(`http://localhost:8000/api/special-requests/user/${user._id}`);
          setSpecialRequests(response.data);
        };
        fetchSpecialRequests();
      }
    } catch (err) {
      toast.error('Failed to create special request. Please try again.'); 
      console.error(err);
    }
  };

  // Define handleEditRequest
  const handleEditRequest = (request) => {
    // Set state to the request that needs to be edited
    setRequestWasteType(request.wasteType);
    setRequestQuantity(request.quantity);
    setRequestDescription(request.description);
    setRequestDate(request.date);
    setRequestTime(request.time);
    setShowCreateRequestForm(true); // Show the request form to edit
  };

  // Define handleDeleteRequest
  const handleDeleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/special-requests/${id}`);
        if (response.status === 204) {
          toast.success('Special request deleted successfully!'); // Show success toast
          // Fetch updated special requests after deletion
          const fetchSpecialRequests = async () => {
            const response = await axios.get(`http://localhost:8000/api/special-requests/user/${user._id}`);
            setSpecialRequests(response.data);
          };
          fetchSpecialRequests();
        }
      } catch (err) {
        toast.error('Failed to delete special request. Please try again.'); // Show error toast
        console.error(err);
      }
    }
  };

  return (
    <div className="user-home">
      <NavbarComponent />

      {/* Bin Section */}
      <div className="user-header" style={{ backgroundColor: '#f4f4f4', padding: '30px' }}>
        <h1>Waste Management</h1>
        {!showCreateBinForm && (
          <Button 
            variant="primary" 
            onClick={() => setShowCreateBinForm(true)} 
            style={{ margin: '20px' }}
          >
            Add New Bin
          </Button>
        )}
      </div>

      {showCreateBinForm && (
        <Container style={{ marginTop: '20px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
          <Button 
            variant="link" 
            onClick={() => { setShowCreateBinForm(false); setBinType(''); setError(''); }} 
            style={{ position: 'absolute', top: '10px', right: '10px', color: '#dc3545' }}
          >
            <AiOutlineClose size={20} />
          </Button>
          <Row className="justify-content-center">
            <Col md={12}>
              <h2>Create Bin</h2>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Form onSubmit={handleCreateBinSubmit}>
                <Form.Group controlId="formBinType">
                  <Form.Label>Bin Type</Form.Label>
                  <Form.Control 
                    as="select" 
                    value={binType} 
                    onChange={(e) => setBinType(e.target.value)} 
                    required
                  >
                    <option value="">Select Bin Type</option>
                    <option value="Organic">Organic</option>
                    <option value="Paper">Paper</option>
                    <option value="Plastic">Plastic</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
                
                <Button variant="primary" type="submit" className="mt-3">Create Bin</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}

      {/* Increased size for bin cards */}
      <div style={{ padding: '40px', overflowX: 'auto', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {bins.map((bin) => (
            <Card 
              key={bin._id} 
              style={{ 
                margin: '10px', 
                backgroundColor: '#e9ecef', 
                border: '1px solid #007bff', 
                borderRadius: '10px', 
                width: '200px',  // Adjusted width for larger cards
                minHeight: '150px' // Adjusted minHeight for larger cards
              }} 
            >
              <Card.Body>
                <Card.Title style={{ fontSize: '16px' }}>Bin ID: {bin.binId}</Card.Title>
                <Card.Text style={{ fontSize: '14px' }}>
                  <strong>Type:</strong> {bin.type}<br />
                  <strong>Percentage:</strong> {bin.percentage}<br />
                </Card.Text>
                <Card.Img variant="bottom" src={bin.qrCode} alt={`QR Code for ${bin.binId}`} style={{ width: '100%', height: 'auto' }} />
                <Button variant="success" onClick={() => handleEditBin(bin)} className="mt-2" size="sm">Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteBin(bin._id)} className="mt-2" style={{ marginLeft: '10px' }} size="sm">Delete</Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {editBin && (
        <Container style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
          <Button 
            variant="link" 
            onClick={() => { setEditBin(null); setBinPercentage(''); setError(''); }} 
            style={{ position: 'absolute', top: '10px', right: '10px', color: '#dc3545' }}
          >
            <AiOutlineClose size={20} />
          </Button>
          <Row className="justify-content-center">
            <Col md={12}>
              <h2>Edit Bin</h2>
              {error && <div style={{ color: 'red' }}>{error}</div>}
              <Form onSubmit={handleUpdateBin}>
                <Form.Group controlId="formBinPercentage">
                  <Form.Label>Bin Percentage</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={binPercentage} 
                    onChange={(e) => setBinPercentage(e.target.value)} 
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">Update Bin</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}

      {/* Special Requests Section */}
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', marginTop: '20px' }}>
        <h1 style={{ textAlign: 'center' }}>Special Requests</h1>
        {!showCreateRequestForm && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="primary"
              onClick={() => setShowCreateRequestForm(true)}
              style={{ alignContent: 'center' }}
            >
              Add New Request
            </Button>
          </div>
        )}

        {showCreateRequestForm && (
          <Container style={{ marginTop: '20px', backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px', maxWidth: '400px', position: 'relative' }}>
            <Button 
              variant="link" 
              onClick={() => { setShowCreateRequestForm(false); setRequestWasteType(''); setRequestQuantity(''); setRequestDescription(''); setRequestDate(''); setRequestTime(''); }} 
              style={{ position: 'absolute', top: '10px', right: '10px', color: '#dc3545' }}
            >
              <AiOutlineClose size={20} />
            </Button>
            <Row className="justify-content-center">
              <Col md={12}>
                <h3>Create Special Request</h3>
                <Form onSubmit={handleCreateRequestSubmit}>
                  <Form.Group controlId="formRequestWasteType">
                    <Form.Label>Waste Type</Form.Label>
                    <Form.Control 
                      as="select" 
                      value={requestWasteType} 
                      onChange={(e) => setRequestWasteType(e.target.value)} 
                      required
                    >
                      <option value="">Select Waste Type</option>
                      <option value="Organic">Organic</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Paper">Paper</option>
                      <option value="Electronic">Electronic</option>
                      <option value="Other">Other</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formRequestQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={requestQuantity} 
                      onChange={(e) => setRequestQuantity(e.target.value)} 
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formRequestDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      value={requestDescription} 
                      onChange={(e) => setRequestDescription(e.target.value)} 
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formRequestDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={requestDate} 
                      onChange={(e) => setRequestDate(e.target.value)} 
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formRequestTime">
                    <Form.Label>Time</Form.Label>
                    <Form.Control 
                      type="time" 
                      value={requestTime} 
                      onChange={(e) => setRequestTime(e.target.value)} 
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="mt-3">Create Request</Button>
                </Form>
              </Col>
            </Row>
          </Container>
        )}

        {/* Special Request Cards with Edit and Delete Buttons */}
        <div style={{ padding: '20px', overflowX: 'auto', backgroundColor: '#f8f9fa' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {specialRequests.map((request) => (
              <Card 
                key={request._id} 
                style={{ 
                  margin: '10px', 
                  backgroundColor: '#e9ecef', 
                  border: '1px solid #007bff', 
                  borderRadius: '10px', 
                  width: '250px',  // Adjusted width for larger cards
                  minHeight: '200px' // Adjusted minHeight for larger cards
                }} 
              >
                <Card.Body>
                  <Card.Title style={{ fontSize: '16px' }}>Request ID: {request.requestId}</Card.Title>
                  <Card.Text style={{ fontSize: '14px' }}>
                    <strong>Waste Type:</strong> {request.wasteType}<br />
                    <strong>Quantity:</strong> {request.quantity}<br />
                    <strong>Description:</strong> {request.description}<br />
                    <strong>Date:</strong> {request.date}<br />
                    <strong>Time:</strong> {request.time}<br />
                  </Card.Text>
                  {/* Edit and Delete icons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="link" 
                      onClick={() => handleEditRequest(request)} 
                      style={{ color: '#28a745' }}
                    >
                      <AiOutlineEdit size={20} />
                    </Button>
                    <Button 
                      variant="link" 
                      onClick={() => handleDeleteRequest(request._id)} 
                      style={{ color: '#dc3545', marginLeft: '10px' }}
                    >
                      <AiOutlineDelete size={20} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default WasteManagement;