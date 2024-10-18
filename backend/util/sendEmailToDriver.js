const nodemailer = require('nodemailer');
const { EMAIL, APP_PASSWORD } = process.env;

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Example using Gmail, configure as per your email service
  auth: {
    user: EMAIL,
    pass: APP_PASSWORD
  },
});

// Function to send email
const sendEmailToDriver = async (driverEmail, requestId, drivername) => {
  const mailOptions = {
    from: `"ECO SORT" <${EMAIL}>`, // Sender address
    to: driverEmail, // List of recipients
    subject: 'New Driver Assignment', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">Driver Assignment Notification</h2>
        <p>Dear ${drivername},</p>
        <p>You have been assigned a new special request with ID: <strong>${requestId}</strong>.</p>
        <p>Please check your dashboard for more details.</p>
        <p>Thank you!</p>
      </div>
    `, // HTML body content
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmailToDriver;