import React from 'react';
import { FaHistory, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

const StatusHistory = ({ statusHistory = [], getStatusColor, formatDate }) => {
  return (
    <div className="bg-white shadow overflow-hidden rounded-lg">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Status History</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Timeline of status changes.</p>
        </div>
        <FaHistory className="h-5 w-5 text-gray-400" />
      </div>
      <div className="border-t border-gray-200">
        {statusHistory && statusHistory.length > 0 ? (
          <div className="flow-root px-4 py-5 sm:p-6">
            <ul className="-mb-8">
              {statusHistory.map((status, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== statusHistory.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(status.status)}`}>
                          <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900">{status.status}</p>
                          {status.note && (
                            <p className="mt-1 text-sm text-gray-500">{status.note}</p>
                          )}
                          {/* Support for legacy single document */}
                          {status.requiredDocument && (
                            <p className="mt-1 text-sm text-yellow-600">
                              <FaFileAlt className="inline mr-1" />
                              Required document: {status.requiredDocument}
                            </p>
                          )}
                          {/* Support for multiple documents */}
                          {status.requiredDocuments && status.requiredDocuments.length > 0 && (
                            <div className="mt-1">
                              <p className="text-sm text-yellow-600 font-medium">
                                <FaFileAlt className="inline mr-1" />
                                Required documents:
                              </p>
                              <ul className="list-disc pl-6 mt-1">
                                {status.requiredDocuments.map((doc, index) => (
                                  <li key={index} className="text-sm text-yellow-600">
                                    {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {status.tentativeDate && (
                            <p className="mt-1 text-sm text-blue-600">
                              <FaCalendarAlt className="inline mr-1" />
                              Next update: {formatDate(status.tentativeDate)}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {formatDate(status.date)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6 text-center text-sm text-gray-500">
            No status history available.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusHistory;
