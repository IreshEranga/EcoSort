import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarComponent from '../../components/NavbarComponent';
import { Button, Card, Form, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import both toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { AiOutlineClose } from 'react-icons/ai'; // Import close icon from react-icons

function WasteManagement() {
  const navigate = useNavigate();
  const [bins, setBins] = useState([]);
  const [user, setUser] = useState(null);
  const [binType, setBinType] = useState('');
  const [binPercentage, setBinPercentage] = useState('');
  const [error, setError] = useState('');
  const [showCreateBinForm, setShowCreateBinForm] = useState(false);
  const [editBin, setEditBin] = useState(null);

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

  return (
    <div className="user-home">
      <NavbarComponent />

      <div className="user-header" style={{ backgroundColor: '#f4f4f4', padding: '30px' }}>
        <h1>Waste Management</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateBinForm(!showCreateBinForm)} 
          style={{ margin: '20px' }}
        >
          {showCreateBinForm ? 'Cancel' : 'Add New Bin'}
        </Button>
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
                    <option value="Electric">Electric</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>
                
                <Button variant="primary" type="submit" className="mt-3">Create Bin</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      )}

      <div style={{ padding: '40px', overflowX: 'auto', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {bins.map((bin) => (
            <Card key={bin._id} style={{ marginRight: '20px', backgroundColor: '#e9ecef', border: '1px solid #007bff', borderRadius: '10px', minWidth: '200px' }}>
              <Card.Body>
                <Card.Title>Bin ID: {bin.binId}</Card.Title>
                <Card.Text>
                  <strong>Type:</strong> {bin.type}<br />
                  <strong>Percentage:</strong> {bin.percentage}<br />
                </Card.Text>
                <Card.Img variant="bottom" src={bin.qrCode} alt={`QR Code for ${bin.binId}`} style={{ width: '100%', height: 'auto' }} />
                <Button variant="success" onClick={() => handleEditBin(bin)} className="mt-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteBin(bin._id)} className="mt-2" style={{ marginLeft: '10px' }}>Delete</Button>
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
          <h2>Edit Bin</h2>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <Form onSubmit={handleUpdateBin}>
            <Form.Group controlId="formBinPercentage">
              <Form.Label>Update Percentage</Form.Label>
              <Form.Control 
                type="number" 
                value={binPercentage} 
                onChange={(e) => setBinPercentage(e.target.value)} 
                min="0" 
                max="100" 
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Update Bin</Button>
          </Form>
        </Container>
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover theme="colored" />
    </div>
  );
}

export default WasteManagement;