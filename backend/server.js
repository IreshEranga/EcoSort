const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios');
const bodyParser = require('body-parser');

const UserRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');


dotenv.config();

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());



app.use('/api', UserRoutes);
app.use('/api/support', supportRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});