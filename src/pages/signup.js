import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle, FaFacebook, FaUser, FaUserTie } from 'react-icons/fa';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' or 'agent'

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    console.log('Submitting registration for:', email, 'as', userType);
    const result = await register(username, email, phoneNumber, password, userType);

    if (!result.success) {
      setError(result.message || 'Registration failed');
      setIsLoading(false);
    }

    // Note: We don't set isLoading to false on success because the page will redirect
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-white px-4 my-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex">
          <Link
            href="/login"
            className="flex-1 py-4 text-center font-medium bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            Login
          </Link>
          <button className="flex-1 py-4 text-center font-medium bg-white text-gray-800 border-b-2 border-[#b76e79]">
            Sign Up
          </button>
        </div>

        <div className="p-6">
          {/* User Type Selection */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Sign up as
            </h2>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => setUserType("user")}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border ${
                  userType === "user"
                    ? "bg-rose-50 border-[#b76e79] text-[#ae5361]"
                    : "border-gray-300 text-black hover:bg-gray-50"
                }`}
              >
                <FaUser className="text-2xl mb-2" />
                <span className="font-medium">User</span>
                <p className="text-xs mt-1 text-gray-500">
                  Apply for visa services
                </p>
              </button>

              <button
                type="button"
                onClick={() => setUserType("agent")}
                className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg border ${
                  userType === "agent"
                    ? "bg-rose-50border-[#b76e79] text-[#ae5361]"
                    : "border-gray-300 text-black hover:bg-gray-50"
                }`}
              >
                <FaUserTie className="text-2xl mb-2" />
                <span className="font-medium">Agent</span>
                <p className="text-xs mt-1 text-gray-500">
                  Process visa applications
                </p>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#b76e79] hover:bg-[#774149] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  );
}
