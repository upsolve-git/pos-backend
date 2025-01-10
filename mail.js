const nodemailer = require("nodemailer");
const dotenv = require('dotenv') 

dotenv.config()  

const mailtemplate = (name, link) => {
    return `
    <!DOCTYPE html>
<html>
<head>
    <title>Appointment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #4caf50;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin: 20px 0;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #333;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #4caf50;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Appointment Confirmed</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We are pleased to confirm your appointment booking. Thank you for choosing our services!</p>
            <p>To view the details of your appointment or make any changes, please log in to your account.</p>
            <a href=${link} class="button">Log in to Your Account</a>
        </div>
        <div class="footer">
            <p>If you have any questions or need further assistance, please contact us at [Support Email] or call [Support Phone].</p>
            <p>Thank you!</p>
        </div>
    </div>
</body>
</html>
    `; 
} 
    
const sendMail = async(email, name, link) => {
    try {   
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        } 
      });
  
      const mailConfigurations = {
        from: process.env.EMAIL,
        to: email,
        subject:"Appointment Confirmation",
        html:mailtemplate(name, link)
      };
  
      await transporter.sendMail(mailConfigurations);
      console.log("Email Sent Successfully");
    } catch (error) {
      console.error("Error sending email:", error.message);
      throw error
    }
}

module.exports = {
    sendMail
}