import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { getUserByEmail } from '@/lib/firestore';

// Define both the new and old JWT secrets for backward compatibility
const JWT_SECRET = process.env.JWT_SECRET || 'immiza-secure-jwt-secret-key-2023';
const OLD_JWT_SECRET = 'your-production-key'; // The previous secret

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

    // Try to verify with the current secret
    let decoded;
    try {
      decoded = jwt.verify(tokenString, JWT_SECRET);
    } catch (newSecretError) {
      // If that fails, try with the old secret
      try {
        decoded = jwt.verify(tokenString, OLD_JWT_SECRET);
        console.log('Token verified with old secret in validate API');
      } catch (oldSecretError) {
        // If both fail, throw the original error
        throw newSecretError;
      }
    }

    // Verify that the user still exists in the database
    const user = await getUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Include verification status for agents
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      projectCount: user.projectCount || 0,
    };

    // Add verification fields for agents
    if (user.role === 'agent') {
      userResponse.verificationStatus = user.verificationStatus || 'approved'; // Default to approved for existing agents
      userResponse.verificationDate = user.verificationDate || new Date().toISOString();
      userResponse.acceptedApplications = user.acceptedApplications || [];
    }

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }
}
