import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import { signIn } from '@/lib/auth-firebase';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '@/lib/firestore';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Check if user exists in Firestore
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    // Note: In a real implementation, you should use Firebase Auth directly
    // This is a temporary solution until we fully migrate to Firebase Auth
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

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
    console.log('Login successful, token set in cookie');

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message,
    });
  }
}
