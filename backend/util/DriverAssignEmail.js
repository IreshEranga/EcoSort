// util/sendEmail.js
const nodemailer = require('nodemailer');
const { EMAIL, APP_PASSWORD } = process.env;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service provider
  auth: {
    user: EMAIL,
    pass: APP_PASSWORD
  }
});

const sendAssignmentEmail = async (to, driverName, routeName) => {
  const mailOptions = {
    from: `"ECO SORT" <${EMAIL}>`, // Sender address
    to, // Receiver address
    subject: `New Route Assignment: ${routeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Hello ${driverName},</h2>
        <p>You have been assigned to a new route: <strong>${routeName}</strong>.</p>
        <p>Thank you for your service!</p>
        <p>Best Regards,<br>The Eco SORT Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendAssignmentEmail;
