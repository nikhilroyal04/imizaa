import { getAllContacts } from '@/lib/firestore';
import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  try {
    // Handle GET request - list all contacts
    if (req.method === 'GET') {
      // Check if user is admin
      const token = getCookie('token', { req, res });

      // For debugging in production
      console.log('Token from cookie:', token ? 'Token exists' : 'No token');

      // In development mode, bypass authentication
      if (process.env.NODE_ENV === 'development') {
        const contacts = await getAllContacts();
        return res.status(200).json({
          success: true,
          count: contacts.length,
          data: contacts,
        });
      }

      // In production, verify authentication
      if (!token) {
        console.log('No token found in request');
        return res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
      }

      try {
        // Make sure token is a string
        const tokenString = String(token);

        // Verify token
        const decoded = jwt.verify(tokenString, JWT_SECRET);

        // For debugging in production
        console.log('Token decoded, role:', decoded.role);

        if (decoded.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized',
          });
        }

        const contacts = await getAllContacts();

        return res.status(200).json({
          success: true,
          count: contacts.length,
          data: contacts,
        });
      } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({
          success: false,
          message: 'Authentication failed',
          error: error.message,
        });
      }
    }

    // Handle other methods
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  } catch (error) {
    console.error('Error in contact API:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}
