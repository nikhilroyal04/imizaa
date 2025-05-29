import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { FaPassport, FaUser, FaGlobe } from 'react-icons/fa';
import EmployeeLayout from '@/components/employee/EmployeeLayout';

export default function EmployeeDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  // Fetch countries for display purposes
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries');
        const data = await response.json();
        if (data.success) {
          setCountries(data.countries);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Helper function to get country name by ID
  const getCountryById = (countryId) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : 'Unknown';
  };

  // Helper function to get visa type display name
  const getVisaTypeById = (visaType) => {
    const typeMap = {
      'student': 'Student',
      'tourist': 'Tourist',
      'work': 'Work'
    };
    return typeMap[visaType?.toLowerCase()] || visaType;
  };

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/applications');
        if (response.data.success) {
          setApplications(response.data.applications || []);
        } else {
          setError(response.data.message || 'Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('An error occurred while loading applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'employee') {
      fetchApplications();
    } else if (user && user.role !== 'employee') {
      router.push('/');
    }
  }, [user, router]);

  // Filter applications based on employee's country and visa types - ONLY show matching applications
  useEffect(() => {
    if (!user || !applications.length) {
      setFilteredApplications([]);
      return;
    }

    // Show only applications that match employee's country and visa type
    const filtered = applications.filter(app => {
      const matchesCountry = user.country && app.destination?.name === user.country;
      const matchesVisaType = user.visaType && user.visaType.toLowerCase() === app.visaType?.toLowerCase();
      return matchesCountry && matchesVisaType;
    });

    setFilteredApplications(filtered);
  }, [applications, user]);



  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (user.role !== 'employee') {
    return null; // Will redirect in useEffect
  }

  return (
    <EmployeeLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        </div>

        {/* Employee Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your Specialization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaGlobe className="text-rose-500 mr-2" />
              <span className="text-gray-700">
                <strong>Country:</strong> {user.country || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center">
              <FaPassport className="text-rose-500 mr-2" />
              <span className="text-gray-700">
                <strong>Visa Type:</strong> {
                  user.visaType
                    ? getVisaTypeById(user.visaType)
                    : 'Not specified'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Employee Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FaPassport className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">My Assigned Applications</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {filteredApplications.length}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FaUser className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Processed Applications</div>
                <div className="mt-1 text-3xl font-semibold text-gray-900">
                  {filteredApplications.filter(app => app.currentStatus && app.currentStatus !== 'Document Submitted').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <div>
              <h2 className="text-lg font-medium text-gray-900">My Assigned Visa Applications</h2>
              <p className="mt-1 text-sm text-gray-500">
                Applications matching your country and visa type specialization
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visa Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-rose-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No applications match your specialization ({user.country || 'No country'} - {user.visaType ? getVisaTypeById(user.visaType) : 'No visa type'})
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {application.destination?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {getVisaTypeById(application.visaType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(application.currentStatus)}`}>
                          {application.currentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.submittedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
