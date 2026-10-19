import nodemailer from 'nodemailer';
import config from '../config';


const sendEmail = async (to: string, html: string, subject?: string, text?: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    auth: {
      user: config.send_email.nodemailer_email,
      pass: config.send_email.nodemailer_password,
    },
  });

  await transporter.sendMail({
    from: config.send_email.nodemailer_email,
    to,
    subject: subject ? subject : 'User Verification Email',
    text: text || 'Verify your email within 10 minutes.',
    html,
  });
};

export default sendEmail;
