const nodemailer = require("nodemailer");
const dotenv = require('dotenv') 

dotenv.config()  

const mailtemplate = (subject, text, body, link, linktext) => {
    return `
    <style>
      body {
        font-family: 'Abhaya Libre', serif;
      }
    </style>
    
    <div style="font-family: 'Abhaya Libre', serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <div style="padding: 40px; border-radius: 10px;">
        <h2 style="margin-top: 0; color: #5D3891;">${subject}</h2>
        <p>${text}</p>
        <p>${body}</p>
        <p style="text-align: center;">
          <a href=${link} style="display: inline-block; padding: 10px 20px; color: white; background-color: #FF9500; border-radius: 5px; text-decoration: none; margin-top: 20px;">${linktext}</a>
        </p>
      </div>
    </div>
    `; 
} 
    
const sendMail = async(email, subject, text) => {
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
        subject:subject,
        html:text
      };
  
      await transporter.sendMail(mailConfigurations);
      console.log("Email Sent Successfully");
    } catch (error) {
      console.error("Error sending email:", error.message);
      throw error
    }
}

module.exports = {
    sendMail,
    mailtemplate
}