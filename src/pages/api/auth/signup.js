import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { registerUser } from '@/lib/auth-firebase';
import { getUserByEmail, createUser } from '@/lib/firestore';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'immiza-secure-jwt-secret-key-2023';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, phoneNumber, password, userType } = req.body;

    // Check if user already exists
    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Determine user role based on userType
    const role = userType === 'agent' ? 'agent' : 'user';

    // Create user in Firestore
    const userData = {
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      // Note: createdAt will be set by the addDocument function using serverTimestamp()
      // For agents, initialize project count and set verification status
      ...(role === 'agent' && {
        projectCount: 0,
        acceptedApplications: [],
        verificationStatus: 'pending',
        verificationDate: new Date().toISOString()
      })
    };

    const user = await createUser(userData);

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set cookie with secure options
    setCookie('token', token, {
      req,
      res,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax', // 'strict' can cause issues with redirects, 'lax' is a good balance
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
    });

    // For debugging in production
    console.log('Signup successful, token set in cookie');

    // Include verification status for agents
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    // Add verification fields for agents
    if (user.role === 'agent') {
      userResponse.verificationStatus = user.verificationStatus;
      userResponse.verificationDate = user.verificationDate;
    }

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
}
