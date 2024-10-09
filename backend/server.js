const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios');
const bodyParser = require('body-parser');

const UserRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const DriverRoutes = require('./routes/driverRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());



app.use('/api', UserRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/driver', DriverRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});