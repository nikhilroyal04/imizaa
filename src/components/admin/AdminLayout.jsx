import React from 'react';
import { useRouter } from 'next/router';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div>
        <main className="min-h-screen pt-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
