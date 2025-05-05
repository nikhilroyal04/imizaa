import { getAllContacts } from '@/lib/firestore';
import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  try {
    // For development/testing purposes, allow access without authentication
    // Remove this in production
    if (process.env.NODE_ENV === 'development') {
      // Handle GET request - list all contacts
      if (req.method === 'GET') {
        const contacts = await getAllContacts();

        return res.status(200).json({
          success: true,
          count: contacts.length,
          data: contacts,
        });
      }
    } else {
      // Check if user is admin
      const token = getCookie('token', { req, res });

      if (!token) {
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

        if (decoded.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Not authorized',
          });
        }

        // Handle GET request - list all contacts
        if (req.method === 'GET') {
          const contacts = await getAllContacts();

          return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts,
          });
        }
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
