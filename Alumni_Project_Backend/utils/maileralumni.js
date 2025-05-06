import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,            // ✅ use STARTTLS
  secure: false,        // ✅ important: false for STARTTLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendMailToAlumni = async (recipients, subject, htmlContent) => {
  const mailOptions = {
    from: `"Alumni Events" <${process.env.GMAIL_USER}>`,
    to: recipients, // comma-separated or array
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
};

export default sendMailToAlumni;
