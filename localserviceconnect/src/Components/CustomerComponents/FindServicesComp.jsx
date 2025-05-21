import React, { useState } from 'react';
import axios from 'axios';
import vader from 'vader-sentiment';
import CustomerNavbar from './CustomerNavbar';

function FindServicesComp() {
  const [problemCategory, setProblemCategory] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [activeSection, setActiveSection] = useState('findServices');
  const [availableTime, setAvailableTime] = useState('');
  const [noProvidersFound, setNoProvidersFound] = useState(false);
  const customerEmail = sessionStorage.getItem('customerEmail');

  const getSentimentScore = (reviews) => {
    let totalScore = 0;
    reviews.forEach((review) => {
      const result = vader.SentimentIntensityAnalyzer.polarity_scores(review.reviewText);
      totalScore += result.compound;
    });
    return totalScore;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNoProvidersFound(false);
    
    try {
      
      const providerRes = await axios.get(`http://localhost:8082/api/serviceProvider/nearby/${customerEmail}`);
      const allProviders = providerRes.data;

      const filtered = allProviders.filter(p => p.serviceCategory === problemCategory);

      console.log(problemCategory);
      

      if (filtered.length === 0) {
        setNoProvidersFound(true);
        return;
      }

      const ranked = filtered.map(provider => ({
        ...provider,
        sentimentScore: getSentimentScore(provider.reviews || [])
      })).sort((a, b) => b.sentimentScore - a.sentimentScore);

      const bestProviders = ranked.slice(0, 3);
      const serviceProviderEmails = bestProviders.map(provider => provider.email);
      const requestPayload = {
        customerEmail,
        problemCategory,
        problemDescription,
        serviceProviderEmails, 
        serviceCharge: 0,
        status: 'WAITING',
        availableTime: availableTime,
        createdTime: new Date().toISOString()
      };

      const saveRes = await axios.post('http://localhost:8082/api/serviceRequest/saveRequest', requestPayload);
      const newRequestId = saveRes.data.requestId;

      // Send emails to all selected providers
      await axios.post(`http://localhost:8082/api/sendEMail/send/${newRequestId}`);

      alert(`Service request submitted and emails sent to  providers!`);
      setProblemCategory('');
      setProblemDescription('');
      setAvailableTime('');
    } catch (error) {
      console.error('Error submitting service request:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="font-sans min-h-screen overflow-x-hidden w-full bg-gray-50">
      {/* Navbar */}
      <CustomerNavbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <section className="flex flex-col md:flex-row pt-32 pb-16 px-4 md:px-16 items-center">
        <div className="w-full bg-white p-8 rounded-lg shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Request a Local Service</h2>

          {noProvidersFound && (
            <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded" role="alert">
              <p className="font-medium">We're sorry</p>
              <p>We don't have any service providers available for this category at this time. Please try again later.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Problem Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Problem Category</label>
              <select
                value={problemCategory}
                onChange={(e) => setProblemCategory(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Select Category --</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Mechanic">Mechanic</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Problem Description</label>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                required
                rows="4"
                placeholder="Describe the issue in detail..."
                className="w-full border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">Available Time</label>
              <input
                type="datetime-local"
                value={availableTime}
                onChange={(e) => setAvailableTime(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default FindServicesComp;