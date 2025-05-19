import { registerUser } from '@/lib/auth-firebase';
import { getUserByEmail, createUser } from '@/lib/firestore';
import bcrypt from 'bcrypt';
import { createToken, setTokenCookie } from '@/lib/token-utils';

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
      }),
      // Add a flag to indicate this is a new user who needs to select visa type
      isNewUser: true
    };

    const user = await createUser(userData);

    // Create token using the utility function
    const token = createToken(user);

    // Set token in cookie using the utility function
    setTokenCookie(req, res, token);

    // For debugging in production
    console.log('Signup successful, token set in cookie');

    // Include verification status for agents
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isNewUser: true, // Always true for new signups
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
