import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// Status flow with days to add for tentative dates
const statusFlow = [
  {
    status: 'Document Submitted',
    message: 'You have submitted the form.',
    daysToAdd: 0,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    status: 'Additional Documents Needed',
    message: 'Additional documents needed.',
    daysToAdd: 4,
    color: 'bg-yellow-100 text-yellow-800'
  },
  {
    status: 'Additional Documents Submitted',
    message: 'Additional documents have been submitted.',
    daysToAdd: 1,
    color: 'bg-green-100 text-green-800'
  },
  {
    status: 'Documents Verified',
    message: 'Documents are being verified.',
    daysToAdd: 2,
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    status: 'Visa Application Submitted',
    message: 'Visa application submitted.',
    daysToAdd: 7,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    status: 'Visa Verification In Progress',
    message: 'Visa verification in progress.',
    daysToAdd: 14,
    color: 'bg-orange-100 text-orange-800'
  },
  {
    status: 'Visa Approved',
    message: 'Visa approved.',
    daysToAdd: 21,
    color: 'bg-green-100 text-green-800'
  },
  {
    status: 'Visa Rejected',
    message: 'Visa rejected.',
    daysToAdd: 21,
    color: 'bg-red-100 text-red-800'
  },
  {
    status: 'Ticket Closed',
    message: 'Ticket closed.',
    daysToAdd: 30,
    color: 'bg-gray-100 text-gray-800'
  }
];

export default function SubmittedApplications({ applications: initialApplications }) {
  const router = useRouter();
  const [applications, setApplications] = useState(initialApplications || []);
  const [loading, setLoading] = useState(!initialApplications);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialApplications) {
      fetchApplications();
    } else {
      setApplications(initialApplications);
    }
  }, [initialApplications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/applications');
      if (response.data.success) {
        console.log('Fetched applications:', response.data.applications);

        // Check for requiredDocuments in status history
        response.data.applications.forEach(app => {
          if (app.currentStatus === 'Additional Documents Needed') {
            console.log('Application needs documents:', app.id || app._id);

            // Find status entries with requiredDocuments
            const entriesWithDocs = app.statusHistory.filter(
              entry => entry.status === 'Additional Documents Needed' &&
              entry.requiredDocuments &&
              Array.isArray(entry.requiredDocuments)
            );

            console.log('Status entries with requiredDocuments:', entriesWithDocs);

            if (entriesWithDocs.length > 0) {
              console.log('Latest entry with docs:', entriesWithDocs[entriesWithDocs.length - 1]);
            }
          }
        });

        setApplications(response.data.applications);
      } else {
        setError(response.data.message || 'Failed to load applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('An error occurred while loading your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get tentative date from status history if available
  const getTentativeDate = (application, currentStatus) => {
    // Find the latest status entry that matches the current status
    const statusEntry = application.statusHistory
      .filter(entry => entry.status === currentStatus)
      .sort((a, b) => {
        // Handle different date formats for sorting
        const dateA = b.date && b.date.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date || 0);
        const dateB = a.date && a.date.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date || 0);
        return dateA - dateB;
      })[0];

    if (statusEntry && statusEntry.tentativeDate) {
      // If tentative date exists, format and return it
      return formatSubmissionDate(statusEntry.tentativeDate);
    }

    // If no tentative date is set, return a message
    return "To be determined";
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const statusInfo = statusFlow.find(s => s.status === status);
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800';
  };

  // Helper function to get status message
  const getStatusMessage = (status) => {
    const statusInfo = statusFlow.find(s => s.status === status);
    return statusInfo ? statusInfo.message : status;
  };

  // Helper function to format submission date
  const formatSubmissionDate = (firestoreDate) => {
    if (!firestoreDate) return 'N/A';

    // Handle Firestore Timestamp objects
    if (firestoreDate && firestoreDate.seconds) {
      return new Date(firestoreDate.seconds * 1000).toLocaleDateString();
    }

    // Handle ISO strings
    if (typeof firestoreDate === 'string') {
      try {
        return new Date(firestoreDate).toLocaleDateString();
      } catch (error) {
        return 'Invalid Date';
      }
    }

    // Handle Date objects
    if (firestoreDate instanceof Date) {
      return firestoreDate.toLocaleDateString();
    }

    return 'N/A';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchApplications}
          className="mt-2 text-sm text-red-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Submitted Applications</h2>

      {applications?.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id || application._id}
              className="bg-white rounded-lg border p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{application.name}</h3>
                  <p className="text-gray-600">Application ID: {application.id || application._id}</p>
                  {application.destination && application.visaType && (
                    <p className="text-gray-700 font-medium">
                      {application.visaType} Visa - {application.destination.name}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">Submitted: {formatSubmissionDate(application.submissionDateISO || application.submissionDate)}</p>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.currentStatus)}`}>
                    {application.currentStatus}
                  </span>
                  {/* <p className="text-sm text-gray-500 mt-1">
                    Next Update: {getTentativeDate(application, application.currentStatus)}
                  </p> */}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-gray-700 mb-4">
                  <span className="font-medium">Status:</span> {getStatusMessage(application.currentStatus)}
                </p>

                {application.currentStatus === 'Additional Documents Needed' && (
                  <div className="mb-4">
                    {/* Find the latest status entry with required documents */}
                    {(() => {
                      // First check for multiple documents
                      let latestStatusWithDocs = application.statusHistory
                        .filter(entry =>
                          entry.status === 'Additional Documents Needed' &&
                          entry.requiredDocuments &&
                          Array.isArray(entry.requiredDocuments) &&
                          entry.requiredDocuments.length > 0
                        )
                        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                      // Log for debugging
                      console.log('Latest status with docs:', latestStatusWithDocs);
                      console.log('All status history:', application.statusHistory);

                      // If we don't find an entry with requiredDocuments array, try to create one from requiredDocument
                      if (!latestStatusWithDocs) {
                        const entryWithSingleDoc = application.statusHistory
                          .filter(entry =>
                            entry.status === 'Additional Documents Needed' &&
                            entry.requiredDocument &&
                            typeof entry.requiredDocument === 'string'
                          )
                          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                        if (entryWithSingleDoc) {
                          // Create a copy with requiredDocuments array
                          latestStatusWithDocs = {
                            ...entryWithSingleDoc,
                            requiredDocuments: [entryWithSingleDoc.requiredDocument]
                          };
                          console.log('Created entry with requiredDocuments from requiredDocument:', latestStatusWithDocs);
                        }
                      }

                      // If no multiple documents, check for single document (legacy support)
                      if (!latestStatusWithDocs) {
                        latestStatusWithDocs = application.statusHistory
                          .filter(entry => entry.status === 'Additional Documents Needed' && entry.requiredDocument)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                      }

                      return (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-3">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              {/* If we have multiple documents */}
                              {latestStatusWithDocs?.requiredDocuments && latestStatusWithDocs.requiredDocuments.length > 0 ? (
                                <div>
                                  <p className="text-sm font-medium text-yellow-700">Required Documents:</p>
                                  <ul className="list-disc pl-5 mt-1">
                                    {Array.isArray(latestStatusWithDocs.requiredDocuments) &&
                                     latestStatusWithDocs.requiredDocuments.map((doc, index) => {
                                      if (!doc) return null; // Skip empty entries

                                      // Check if this document has been uploaded
                                      const isUploaded = application.documents &&
                                        application.documents.some(uploadedDoc =>
                                          uploadedDoc.type === doc ||
                                          uploadedDoc.type.toLowerCase() === doc.toLowerCase()
                                        );

                                      return (
                                        <li key={index} className={`text-sm ${isUploaded ? 'text-green-600' : 'text-yellow-700'}`}>
                                          <a
                                            href={`/dashboard/upload-documents/${application.id || application._id}`}
                                            className="hover:underline flex items-center"
                                          >
                                            {isUploaded ? (
                                              <svg className="inline-block h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <svg className="inline-block h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                            {doc} {isUploaded ? '(Uploaded)' : ''}
                                          </a>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              ) : (
                                // Legacy single document support
                                <p className="text-sm text-yellow-700">
                                  <span className="font-medium">Required Document: </span>
                                  <a
                                    href={`/dashboard/upload-documents/${application.id || application._id}`}
                                    className="hover:underline"
                                  >
                                    {latestStatusWithDocs?.requiredDocument || "Additional document needed"}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    <button
                      onClick={() => router.push(`/dashboard/upload-documents/${application.id || application._id}`)}
                      className="bg-yellow-500 text-white py-1.5 px-4 rounded-md hover:bg-yellow-600 transition-colors text-sm"
                    >
                      Upload All Required Documents
                    </button>
                  </div>
                )}

                <h4 className="font-medium mb-2 text-gray-700">Status Timeline</h4>
                <div className="space-y-2">
                  {/* Filter and deduplicate status history entries */}
                  {(() => {
                    // Create a map to store the most recent entry for each status
                    const statusMap = new Map();

                    // Sort status history by date (newest first)
                    const sortedHistory = [...application.statusHistory].sort((a, b) => {
                      const dateA = a.date && a.date.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date || 0);
                      const dateB = b.date && b.date.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date || 0);
                      return dateB - dateA;
                    });

                    // Get the most recent entry for each status
                    sortedHistory.forEach(entry => {
                      if (!statusMap.has(entry.status)) {
                        statusMap.set(entry.status, entry);
                      }
                    });

                    // Convert map values to array
                    const uniqueEntries = Array.from(statusMap.values());

                    // Sort entries according to the status flow order
                    const orderedEntries = uniqueEntries.sort((a, b) => {
                      const indexA = statusFlow.findIndex(s => s.status === a.status);
                      const indexB = statusFlow.findIndex(s => s.status === b.status);
                      return indexA - indexB;
                    });

                    // Render the timeline
                    return orderedEntries.map((status, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center text-sm mb-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                          <span className="text-gray-700">{status.status}</span>
                          <span className="text-gray-500 ml-2 sm:ml-auto">
                            {formatSubmissionDate(status.date)}
                          </span>
                        </div>
                        {status.tentativeDate && (
                          <div className="ml-6 sm:ml-auto mt-1 sm:mt-0">
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              Next update: {formatSubmissionDate(status.tentativeDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>

                {/* {application.documents?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-gray-700">Uploaded Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {application.documents.map((doc, index) => (
                        <div key={index} className="border rounded-md p-2 text-sm">
                          <p className="font-medium">{doc.type}</p>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Document
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No applications submitted yet.</p>
          <button
            onClick={() => router.push('/apply')}
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Application
          </button>
        </div>
      )}
    </div>
  );
}

