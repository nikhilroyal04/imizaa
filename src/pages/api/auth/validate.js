import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { getUserByEmail } from '@/lib/firestore';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from cookie
    const token = getCookie('token', { req, res });

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    // Make sure token is a string
    const tokenString = String(token);

    // Verify token
    const decoded = jwt.verify(tokenString, JWT_SECRET);

    // Verify that the user still exists in the database
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
}
