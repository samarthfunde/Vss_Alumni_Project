import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { convert } from 'html-to-text';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  const text = convert(html, {
    wordwrap: 130
  });

  const mailOptions = {
    from: "VSS",
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
