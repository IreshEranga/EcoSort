import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import './DriversPage.css';
import axios from 'axios'; // For making API requests
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cities = [
  'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 
  'Anuradhapura', 'Trincomalee', 'Matara', 'Batticaloa', 
  'Kurunegala', 'Ratnapura', 'Nuwara Eliya', 'Vavuniya', 
  'Mannar', 'Gampaha', 'Hambantota', 'Kalutara', 
  'Puttalam', 'Badulla', 'Monaragala', 'Polonnaruwa'
];

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // For modal visibility
  const [isUpdate, setIsUpdate] = useState(false); // Flag to check if updating
  const [newDriver, setNewDriver] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    status: 'available'
  });
  const [selectedDriverId, setSelectedDriverId] = useState(null); // Track selected driver for update

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/driver/drivers');
        setUsers(response.data);
        setFilteredUsers(response.data); // Set filtered users initially to all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    
    // Filter users based on search term
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.city.toLowerCase().includes(value)
    );

    setFilteredUsers(filtered);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver((prevDriver) => ({
      ...prevDriver,
      [name]: value
    }));
  };

  // Handle driver form submission for adding or updating
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isUpdate) {
      // Update existing driver
      try {
        await axios.put(`http://localhost:8000/api/driver/drivers/${selectedDriverId}`, newDriver);
        const response = await axios.get('http://localhost:8000/api/driver/drivers');
        setUsers(response.data);
        setFilteredUsers(response.data);
        setShowModal(false);
        toast.success('Driver updated successfully!');
        resetForm();
      } catch (error) {
        console.error('Error updating driver:', error);
        toast.error('Error updating driver.');
      }
    } else {
      // Add new driver
      try {
        await axios.post('http://localhost:8000/api/driver/drivers', newDriver);
        const response = await axios.get('http://localhost:8000/api/driver/drivers');
        setUsers(response.data);
        setFilteredUsers(response.data);
        setShowModal(false);
        toast.success('Driver added successfully!');
        resetForm();
      } catch (error) {
        console.error('Error adding driver:', error);
        toast.error('Error adding driver.');
      }
    }
  };

  // Handle delete driver
  const handleDeleteDriver = async (driverId) => {
    try {
      await axios.delete(`http://localhost:8000/api/driver/drivers/${driverId}`);
      const response = await axios.get('http://localhost:8000/api/driver/drivers');
      setUsers(response.data);
      setFilteredUsers(response.data);
      toast.success('Driver deleted successfully!');
    } catch (error) {
      console.error('Error deleting driver:', error);
      toast.error('Error deleting driver.');
    }
  };

  // Handle open update form
  const handleUpdateDriver = (driver) => {
    setIsUpdate(true);
    setSelectedDriverId(driver._id);
    setNewDriver({
      name: driver.name,
      email: driver.email,
      mobile: driver.mobile,
      address: driver.address,
      city: driver.city,
      status: driver.status
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setNewDriver({
      name: '',
      email: '',
      mobile: '',
      address: '',
      city: '',
      status: 'available'
    });
    setSelectedDriverId(null);
    setIsUpdate(false);
  };

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Driver Report', 14, 20);
    const headers = ['Name', 'Email', 'Mobile', 'Address', 'City'];
    const data = filteredUsers.map(user => [
      user.name,
      user.email,
      user.mobile,
      user.address,
      user.city
    ]);

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });

    doc.save('driver_report.pdf');
  };

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="main-content" style={{ backgroundColor: '#ffffff' }}>
        <h1 className="topic" style={{ color: 'black' }}>Drivers</h1>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name, city, or type..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="buttons-section">
            {filteredUsers.length > 0 && (
              <>
                <button className="btn btn-primary" onClick={generatePDF}>
                  Download PDF Report
                </button>
                <button className="btn btn-secondary" onClick={() => { setShowModal(true); resetForm(); }}>
                  Add Driver
                </button>
              </>
            )}
          </div>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>City</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.address}</td>
                  <td>{user.city}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleUpdateDriver(user)}
                      style={{backgroundColor:'#34ca61', color:'white'}}>Update</button>
                    <button className="btn btn-delete" onClick={() => handleDeleteDriver(user._id)}
                      style={{backgroundColor:'#b40404', marginLeft:'30px', color:'white'}}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No drivers found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Add/Update Driver Modal */}
        {showModal && (
          <div className="modal-overlayDriver" style={{marginLeft:'400px', marginTop:'50px', marginBottom:'20px'}}>
            <div className="modal-contentDriver" style={{marginTop:'-220px', backgroundColor:'white', padding:'20px',boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'}}>
              <h2>{isUpdate ? 'Update Driver' : 'Add Driver'}</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newDriver.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newDriver.email}
                    onChange={handleInputChange}
                    required
                    disabled={isUpdate} // Disable email field during update
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="mobile">Mobile:</label>
                  <input
                    type="text"
                    id="mobile"
                    name="mobile"
                    value={newDriver.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newDriver.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City:</label>
                  <select
                    id="city"
                    name="city"
                    value={newDriver.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={newDriver.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {isUpdate ? 'Update Driver' : 'Add Driver'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default UsersPage;
