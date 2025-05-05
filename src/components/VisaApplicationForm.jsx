import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function VisaApplicationForm() {
  const router = useRouter();
  const { destinationId, destinationName, visaType } = router.query;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passportPhoto: null,
    passportFront: null,
    passportBack: null,
    destinationId: '',
    destinationName: '',
    visaType: ''
  });

  // Update form data when query parameters change
  useEffect(() => {
    if (destinationId && destinationName && visaType) {
      setFormData(prev => ({
        ...prev,
        destinationId,
        destinationName,
        visaType
      }));
    }
  }, [destinationId, destinationName, visaType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to upload a file to Cloudinary
  const uploadFile = async (file, documentType) => {
    if (!file) return null;

    try {
      console.log(`Uploading ${documentType}...`);

      // Convert file to base64
      const base64Data = await fileToBase64(file);

      // Prepare the request data
      const requestData = {
        file: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        },
        documentType
      };

      // Make the API request
      const response = await axios.post('/api/upload', requestData);

      // Check if the upload was successful
      if (response.data.success) {
        console.log(`Successfully uploaded ${documentType}:`, response.data.file.url);
        return response.data.file;
      } else {
        console.error(`Failed to upload ${documentType}:`, response.data.message);
        setError(`Failed to upload ${documentType}: ${response.data.message}`);
        return null;
      }
    } catch (error) {
      console.error(`Error uploading ${documentType}:`, error);
      setError(`Error uploading ${documentType}: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Upload all files to Cloudinary
      const uploadedDocuments = [];

      // Upload passport photo
      const passportPhoto = await uploadFile(formData.passportPhoto, 'Passport Photo');
      if (passportPhoto) uploadedDocuments.push(passportPhoto);

      // Upload passport front
      const passportFront = await uploadFile(formData.passportFront, 'Passport Front');
      if (passportFront) uploadedDocuments.push(passportFront);

      // Upload passport back
      const passportBack = await uploadFile(formData.passportBack, 'Passport Back');
      if (passportBack) uploadedDocuments.push(passportBack);

      // Check if all required documents were uploaded
      if (uploadedDocuments.length < 3) {
        setError('Failed to upload all required documents. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for submission
      const submitData = {
        name: formData.name,
        email: formData.email,
        destinationId: formData.destinationId,
        destinationName: formData.destinationName,
        visaType: formData.visaType,
        documents: uploadedDocuments
      };

      // Submit the data to the API
      const response = await axios.post('/api/applications/submit', submitData);

      if (response.data.success) {
        // Show success message and redirect to dashboard
        alert('Application submitted successfully! Your data has been saved to MongoDB with secure image URLs.');
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Submit Visa Application</h2>

      {/* Display destination and visa type information if available */}
      {formData.destinationName && formData.visaType && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            You are applying for a <strong>{formData.visaType} Visa</strong> to <strong>{formData.destinationName}</strong>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Size Photo
          </label>
          <input
            type="file"
            name="passportPhoto"
            required
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Front Photo
          </label>
          <input
            type="file"
            name="passportFront"
            required
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Back Photo
          </label>
          <input
            type="file"
            name="passportBack"
            required
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Please check in the future for further requirements.
          </p>
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}