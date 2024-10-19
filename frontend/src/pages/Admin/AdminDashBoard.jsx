/*import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar'; // Import the sidebar component
import './AdminDashBoard.css'; // Optional: Create styles for the main dashboard
import axios from 'axios'; // For making API requests
import { ClipLoader } from 'react-spinners'; // Import ClipLoader for loading animation

export default function AdminDashBoard() {
  const [userCount, setUserCount] = useState(0); // State to hold user count
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
  const [specialRequestCount, setSpecialRequestCount] = useState(0); // State to hold special request count

  // Loading states for each API request
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/users'); // Ensure this matches your backend route
        const users = response.data; // Assuming the API returns an array of users
        setUserCount(users.length); // Set the user count based on array length
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false); // Stop loading after fetching
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/driver/drivers'); // Ensure this matches your backend route
        const drivers = response.data; // Assuming the API returns an array of drivers
        setDriverCount(drivers.length); // Set the driver count based on array length
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoadingDrivers(false); // Stop loading after fetching
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const today = getCurrentDay();

        // Filter routes based on today's day
        const filteredRoutes = response.data.filter(route => route.date === today);

        setRouteCount(filteredRoutes.length); // Set initial filtered routes to the full list
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setIsLoadingRoutes(false); // Stop loading after fetching
      }
    };

    fetchRoutes();
  }, []);

  // Fetch current special request count from the backend
  useEffect(() => {
    const fetchSpecialRequestCount = async () => {
      setIsLoadingRequests(true);
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests/count-current'); // Your new backend route
        const { totalCurrentRequests } = response.data; // Adjusted to match the new API response
        setSpecialRequestCount(totalCurrentRequests); // Set the current special request count
      } catch (error) {
        console.error('Error fetching current special requests:', error);
      } finally {
        setIsLoadingRequests(false); // Stop loading after fetching
      }
    };

    fetchSpecialRequestCount();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminSidebar /> 

      
      <div className="main-content" style={{ backgroundColor: 'white' }}>
        <h1>Welcome Admin !</h1>

        <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: 20, backgroundColor: '#ffffff', border: '1px solid #ffffff' }}>
         
          <div className="user-count-card" style={{ marginLeft: '50px' }}>
            <h2>Total Users 👤</h2>
            {isLoadingUsers ? (
              <ClipLoader color="#00BFFF" loading={isLoadingUsers} size={30} />
            ) : (
              <p>{userCount}</p>
            )}
          </div>

          <div className="user-count-card">
            <h2>Total Drivers 🚜</h2>
            {isLoadingDrivers ? (
              <ClipLoader color="#00BFFF" loading={isLoadingDrivers} size={30} />
            ) : (
              <p>{driverCount}</p>
            )}
          </div>

         
          <div className="user-count-card">
            <h2>Today Routes 🛣️</h2>
            {isLoadingRoutes ? (
              <ClipLoader color="#00BFFF" loading={isLoadingRoutes} size={30} />
            ) : (
              <p>{routeCount}</p>
            )}
          </div>

         
          <div className="user-count-card">
            <h2>Current Special Requests 🗑️</h2>
            {isLoadingRequests ? (
              <ClipLoader color="#00BFFF" loading={isLoadingRequests} size={30} />
            ) : (
              <p>{specialRequestCount}</p>
            )}
          </div>
       </div>

        
      </div>
    </div>
  );
}

*/



import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import './AdminDashBoard.css';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashBoard() {
  const [userCount, setUserCount] = useState(0);
  const [driverCount, setDriverCount] = useState(0);
  const [routeCount, setRouteCount] = useState(0);
  const [specialRequestCount, setSpecialRequestCount] = useState(0);

  const [routeDataByCity, setRouteDataByCity] = useState({ labels: [], data: [] }); // For chart data
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const getCurrentDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/users');
        setUserCount(response.data.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
      try {
        const response = await axios.get('http://localhost:8000/api/driver/drivers');
        setDriverCount(response.data.length);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      } finally {
        setIsLoadingDrivers(false);
      }
    };
    fetchDrivers();
  }, []);

  // Fetch routes and group by city
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        const response = await axios.get('http://localhost:8000/router/routes');
        const today = getCurrentDay();

        // Filter routes by today's date
        const filteredRoutes = response.data.filter(route => route.date === today);

        // Group routes by city
        const routesByCity = filteredRoutes.reduce((acc, route) => {
          const city = route.city;
          if (acc[city]) {
            acc[city]++;
          } else {
            acc[city] = 1;
          }
          return acc;
        }, {});

        // Prepare data for the chart
        const cities = Object.keys(routesByCity);
        const routeCounts = Object.values(routesByCity);

        setRouteDataByCity({ labels: cities, data: routeCounts });
        setRouteCount(filteredRoutes.length);
      } catch (error) {
        console.error('Error fetching routes:', error);
      } finally {
        setIsLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

  // Fetch special requests
  useEffect(() => {
    const fetchSpecialRequestCount = async () => {
      setIsLoadingRequests(true);
      try {
        const response = await axios.get('http://localhost:8000/api/special-requests/count-current');
        setSpecialRequestCount(response.data.totalCurrentRequests);
      } catch (error) {
        console.error('Error fetching current special requests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    fetchSpecialRequestCount();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: routeDataByCity.labels, // Cities
    datasets: [
      {
        label: 'Routes For Today',
        data: routeDataByCity.data, // Number of routes per city
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure each tick represents an increment of 1
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
          },
        },
      },
      x: {
        ticks: {
          autoSkip: true, // Automatically skips some labels if they are too long
          maxRotation: 0, // Prevent labels from rotating
          minRotation: 0, // Keep the labels horizontal
        },
        barThickness: 20, // Set the bar thickness to 20px to reduce the bar width
      maxBarThickness: 25,
      },
    },
  };


  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="main-content" style={{ backgroundColor: 'white' }}>
        <h1>Welcome Admin !</h1>

        <div className="card" style={{ display: 'flex', flexDirection: 'row', gap: 20, backgroundColor: '#ffffff', border: '1px solid #ffffff' }}>
          <div className="user-count-card" style={{ marginLeft: '50px' }}>
            <h2>Total Users 👤</h2>
            {isLoadingUsers ? <ClipLoader color="#00BFFF" size={30} /> : <p>{userCount}</p>}
          </div>

          <div className="user-count-card">
            <h2>Total Drivers 🚜</h2>
            {isLoadingDrivers ? <ClipLoader color="#00BFFF" size={30} /> : <p>{driverCount}</p>}
          </div>

          <div className="user-count-card">
            <h2>Today Routes 🛣️</h2>
            {isLoadingRoutes ? <ClipLoader color="#00BFFF" size={30} /> : <p>{routeCount}</p>}
          </div>

          <div className="user-count-card">
            <h2>Current Special Requests 🗑️</h2>
            {isLoadingRequests ? <ClipLoader color="#00BFFF" size={30} /> : <p>{specialRequestCount}</p>}
          </div>
        </div>

        {/* Chart for routes by city */}
        <div className="route-chart" style={{width:'1050px', backgroundColor:'#f4f4f4', padding:'20px' }}>
          <h2>Routes by City for Today</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
