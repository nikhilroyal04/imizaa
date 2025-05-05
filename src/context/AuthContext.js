import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Save user to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    // Check if user is logged in
    const checkUserLoggedIn = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      // If we already have a user in state from localStorage, don't validate immediately
      // This prevents unnecessary API calls and potential logout on page navigation
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/validate', {
          headers: {
            'Cache-Control': 'no-cache',
          },
          credentials: 'include', // Include cookies in the request
        });

        // Handle non-200 responses
        if (!res.ok) {
          // If token validation fails, clear user data
          if (res.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('user');
            }
            setUser(null);
          }
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success) {
          // Save user data to localStorage for persistence
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // Don't clear user on network errors
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally omitting user to prevent circular updates

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies in the request
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || `Login failed with status: ${res.status}`
        };
      }

      const data = await res.json();

      if (data.success) {
        // Save user data to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setUser(data.user);

        // Redirect admin users directly to admin dashboard
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Something went wrong' };
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (username, email, phoneNumber, password) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ username, email, phoneNumber, password }),
        credentials: 'include', // Include cookies in the request
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          message: errorData.message || `Registration failed with status: ${res.status}`
        };
      }

      const data = await res.json();

      if (data.success) {
        // Save user data to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        setUser(data.user);

        // Redirect admin users directly to admin dashboard
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Something went wrong' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setLoading(true);

      // Even if the API call fails, we want to log the user out on the client side
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
          },
          credentials: 'include', // Include cookies in the request
        });

        await res.json();
      } catch (error) {
        console.error('Logout API error:', error);
      }

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }

      // Always clear the user state and redirect regardless of API success
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still try to log out locally even if there's an error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
