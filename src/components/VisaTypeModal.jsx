import React from 'react';
import { useRouter } from 'next/router';
import { FaPlane, FaBriefcase, FaGraduationCap } from 'react-icons/fa';

const VisaTypeModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleVisaTypeSelect = (visaType) => {
    // Close the modal
    onClose();

    // Store the selected visa type in localStorage for future use
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedVisaType', visaType);
    }

    // Redirect to the home page
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-[10000]">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-2xl leading-6 font-bold text-gray-900 mb-2 text-center">
                  Select Your Visa Type
                </h3>
                <p className="text-center text-gray-500 mb-4">
                  Click on one of the options below to continue
                </p>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {/* Tourist Visa */}
                  <div
                    onClick={() => handleVisaTypeSelect('Tourist')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#b76e79] hover:bg-[#fdf0f2] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    title="Click to select Tourist Visa"
                  >
                    <div className="text-[#b76e79] text-4xl mb-3">
                      <FaPlane />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Tourist</h4>
                    <p className="text-sm text-gray-500 mt-2 text-center">For vacation and leisure travel</p>
                  </div>

                  {/* Work Visa */}
                  <div
                    onClick={() => handleVisaTypeSelect('Work')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#b76e79] hover:bg-[#fdf0f2] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    title="Click to select Work Visa"
                  >
                    <div className="text-[#b76e79] text-4xl mb-3">
                      <FaBriefcase />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Work</h4>
                    <p className="text-sm text-gray-500 mt-2 text-center">For business and employment</p>
                  </div>

                  {/* Student Visa */}
                  <div
                    onClick={() => handleVisaTypeSelect('Student')}
                    className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-[#b76e79] hover:bg-[#fdf0f2] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                    title="Click to select Student Visa"
                  >
                    <div className="text-[#b76e79] text-4xl mb-3">
                      <FaGraduationCap />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Student</h4>
                    <p className="text-sm text-gray-500 mt-2 text-center">For education and study</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b76e79] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaTypeModal;
