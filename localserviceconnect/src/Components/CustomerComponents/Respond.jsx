import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RespondToRequest = () => {
  const [showChargeInput, setShowChargeInput] = useState(false);
  const [serviceCharge, setServiceCharge] = useState('');
  const [serviceRequestId, setServiceRequestId] = useState('');
  const [message, setMessage] = useState('');
  const [providerEmail, setProviderEmail] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const email = params.get('providerEmail');

    if (id) {
      setServiceRequestId(id);
      axios.get(`http://localhost:8082/api/customer/getCustomerDetails/${id}`)
        .then(response => {
          setCustomerDetails(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching customer details", err);
          setLoading(false);
          setMessage("Failed to load customer details");
        });
    } else {
      setLoading(false);
      setMessage("No service request ID provided");
    }

    if (email) {
      setProviderEmail(email);
    }
  }, []);

  const navigate = useNavigate();

  const handleResponse = async (status) => {
    if (status === 'ACCEPTED') {
      if (!showChargeInput) {
        setShowChargeInput(true);
        return;
      }

      if (!serviceCharge || isNaN(serviceCharge) || serviceCharge <= 0) {
        setMessage('Please enter a valid service charge.');
        return;
      }
    }

    try {
      const res = await axios.post(
        `http://localhost:8082/api/sendEMail/respondWithCharge/${serviceRequestId}`,
        null,
        {
          params: {
            serviceCharge: status === 'ACCEPTED' ? serviceCharge : 0,
            status,
            providerEmail
          },
        }
      );

      if (status === 'ACCEPTED') {
        setMessage('Request accepted successfully! Redirecting...');
      } else {
        setMessage('Request rejected. This request will be sent to another service provider.');
      }

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data || 'Something went wrong.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex justify-center items-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Service Request Details</h2>

        {customerDetails ? (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-center text-gray-800 mb-3">
              {customerDetails.name || 'Customer'}
            </h3>

            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{customerDetails.email || 'No email provided'}</span>
              </div>

              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{customerDetails.phoneNumber || 'No phone provided'}</span>
              </div>

              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{customerDetails.address || 'No address provided'}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{customerDetails.availableDate || 'Available time not specified'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 mb-4">Customer details not available</div>
        )}

        {!showChargeInput ? (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => handleResponse('ACCEPTED')}
              className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Accept
            </button>
            <button
              onClick={() => handleResponse('REJECTED')}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition font-medium flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        ) : (
          <div className="mt-4 animate-fade-in">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Charge (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  placeholder="Enter your service charge"
                />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowChargeInput(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex-1"
              >
                Back
              </button>
              <button
                onClick={() => handleResponse('ACCEPTED')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex-1"
              >
                Submit Charge
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes('success') ? 'bg-green-100 text-green-800' :
              message.includes('rejected') ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RespondToRequest;
