const dotenv = require('dotenv');
dotenv.config();

const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios');
const bodyParser = require('body-parser');

const UserRoutes = require('./routes/userRoutes');
const supportRoutes = require('./routes/supportRoutes');
const adSupportRoutes = require('./routes/adSupportRoutes');
const DriverRoutes = require('./routes/driverRoutes');
const PaymentRoutes = require('./routes/paymentRoutes');
const WasteRoutes = require('./routes/waste');

const binRoutes = require('./routes/binRoutes');
const driverSupportRoutes = require('./routes/driverSupportRoutes');

const RouterRoutes = require('./routes/routeRoutes');
const SpecialRequestRoutes = require('./routes/specialRequestRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());



app.use('/api', UserRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin/', adSupportRoutes);
app.use('/api/driver', DriverRoutes);
app.use('/api/payment', PaymentRoutes);
app.use('/api/waste', WasteRoutes);


app.use('/api/driverSupport', driverSupportRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/special-requests', SpecialRequestRoutes);

app.use('/router', RouterRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});