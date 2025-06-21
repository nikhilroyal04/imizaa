import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import nodemailer from "nodemailer";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await getAuth().getUserByEmail(email);
    const link = await getAuth().generatePasswordResetLink(email);

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: true, // use true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - IMMIZA',
      html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
    <h1 style="color: #b76e79; margin: 0;">IMMIZA</h1>
    <p style="margin: 0; color: #555;">VISA Immigration Service</p>
  </div>
  <div style="padding: 20px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello ${user.displayName || ''},</p>
    <p>We received a request to reset the password for your IMMIZA account. You can reset your password by clicking the button below:</p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${link}" style="background-color: #b76e79; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
    </div>
    <p>If you did not request a password reset, please ignore this email or contact our support if you have any concerns.</p>
    <p>This password reset link is valid for a limited time.</p>
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    <p style="font-size: 12px; color: #888;">If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:</p>
    <p style="font-size: 12px; color: #888; word-break: break-all;">${link}</p>
  </div>
  <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #888;">
    <p>&copy; ${new Date().getFullYear()} IMMIZA. All rights reserved.</p>
  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error.code === 'auth/user-not-found') {
        // We don't want to reveal that the user doesn't exist for security reasons.
        // So we send a generic success message.
        return res.status(200).json({ success: true, message: 'If your email is registered, you will receive a password reset link.' });
    }
    res.status(500).json({ success: false, message: 'Error sending password reset email.' });
  }
} 