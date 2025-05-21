import React, { useState, useEffect } from 'react';
import { FiMenu, FiSearch, FiX } from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';
import './Style.css';
import vader from 'vader-sentiment';

const ViewFeedbacks = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('viewFeedbacks');

  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [topProviders, setTopProviders] = useState({});

  useEffect(() => {
    fetch('http://localhost:8082/api/feedback/getAllReviews')
      .then((res) => res.json())
      .then((data) => {
        // Perform sentiment analysis on each review
        const analyzedData = performSentimentAnalysis(data);
        setReviews(analyzedData);
        setFilteredReviews(analyzedData);
        
        // Calculate top providers by category
        const bestProviders = findTopProvidersByCategory(analyzedData);
        setTopProviders(bestProviders);
      })
      .catch((err) => console.error('Error fetching reviews:', err));
  }, []);

  // Perform VADER sentiment analysis on review text
  const performSentimentAnalysis = (reviewsData) => {
    return reviewsData.map(review => {
      // The correct way to use vader-sentiment in JavaScript
      const sentimentScores = vader.SentimentIntensityAnalyzer.polarity_scores(review.reviewText);
      
      return {
        ...review,
        neg: sentimentScores.neg.toFixed(3),
        neu: sentimentScores.neu.toFixed(3),
        pos: sentimentScores.pos.toFixed(3),
        compound: sentimentScores.compound.toFixed(4)
      };
    });
  };

  // Find top 3 providers in each category based on compound sentiment scores
  const findTopProvidersByCategory = (reviewsData) => {
    // Group reviews by service category and provider
    const providersByCategory = {};
    
    reviewsData.forEach(review => {
      const { serviceCategory, serviceProviderName, compound, stars } = review;
      
      if (!providersByCategory[serviceCategory]) {
        providersByCategory[serviceCategory] = {};
      }
      
      if (!providersByCategory[serviceCategory][serviceProviderName]) {
        providersByCategory[serviceCategory][serviceProviderName] = {
          reviews: 0,
          totalCompound: 0,
          totalStars: 0
        };
      }
      
      providersByCategory[serviceCategory][serviceProviderName].reviews++;
      providersByCategory[serviceCategory][serviceProviderName].totalCompound += parseFloat(compound);
      providersByCategory[serviceCategory][serviceProviderName].totalStars += stars;
    });
    
    // Calculate average scores and sort providers in each category
    const topProvidersByCategory = {};
    
    Object.keys(providersByCategory).forEach(category => {
      const providers = Object.keys(providersByCategory[category]).map(providerName => {
        const providerData = providersByCategory[category][providerName];
        const avgCompound = providerData.totalCompound / providerData.reviews;
        const avgStars = providerData.totalStars / providerData.reviews;
        
        return {
          name: providerName,
          avgCompound,
          avgStars,
          reviewCount: providerData.reviews
        };
      });
      
      // Sort by average compound score (descending)
      const sortedProviders = providers.sort((a, b) => b.avgCompound - a.avgCompound);
      
      // Get top 3 (or fewer if less than 3 providers exist)
      topProvidersByCategory[category] = sortedProviders.slice(0, 3);
    });
    
    return topProvidersByCategory;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const filtered = reviews.filter(
      (review) =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.serviceProviderName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReviews(filtered);
  }, [searchTerm, reviews]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'viewCustomers', 'viewServiceProviders', 'viewFeedbacks'];
      let currentSection = 'viewFeedbacks';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (section) =>
    `${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-600 transition`;

  // Get unique categories from reviews
  const categories = [...new Set(reviews.map(review => review.serviceCategory))];

  return (
    <div className="font-sans min-h-screen overflow-x-hidden w-full bg-gray-50">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
              <img src={MainLogo} alt="LSC" style={{ width: "28px", height: "35px", borderRadius: "30%" }} />
            </div>
            <h1 className="ml-3 text-xl font-bold" style={{ color: "#161179" }}>LocalServiceConnect</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="/adminDB" className={navLinkClass('home')}>Home</a>
            <a href="/viewCustomers" className={navLinkClass('viewCustomers')}>View Customers</a>
            <a href="/viewServiceProviders" className={navLinkClass('viewServiceProviders')}>View Providers</a>
            <a href="/viewFeedbacks" className={navLinkClass('viewFeedbacks')}>View Feedbacks</a>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="text-red-500 hover:text-red-700 font-semibold transition"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
            <div className="flex flex-col px-4 py-2">
              <a href="/adminDB" className={`py-2 ${navLinkClass('home')}`}>Home</a>
              <a href="/viewCustomers" className={`py-2 ${navLinkClass('viewCustomers')}`}>View Customers</a>
              <a href="/viewServiceProviders" className={`py-2 ${navLinkClass('viewServiceProviders')}`}>View Providers</a>
              <a href="/viewFeedbacks" className={`py-2 ${navLinkClass('viewFeedbacks')}`}>View Feedbacks</a>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="py-2 text-red-500 font-semibold text-left w-full"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <section className="pt-28 px-4 md:px-6 pb-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8 flex-col sm:flex-row">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">All Customer Feedbacks</h2>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search by customer or provider name"
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Top Providers Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Top Service Providers By Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category} className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">{category}</h4>
                  {topProviders[category] && topProviders[category].length > 0 ? (
                    <ol className="space-y-3">
                      {topProviders[category].map((provider, index) => (
                        <li key={provider.name} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-700'
                            }`}>
                              {index + 1}
                            </span>
                            <span className="ml-2 font-medium text-gray-700">{provider.name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="text-sm text-gray-500">
                              <span className="text-yellow-500">★</span> {provider.avgStars.toFixed(1)}
                            </div>
                            <div className="text-xs text-indigo-600">
                              Sentiment: {provider.avgCompound.toFixed(2)}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500 italic">No providers in this category</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold text-indigo-800 mb-4">All Reviews</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review.reviewId} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <h3 className="text-lg font-bold text-blue-700 mb-2">{review.customerName}</h3>
                  <p className="text-sm text-gray-600 mb-1 italic">
                    Service: <span className="text-gray-800 font-medium">{review.serviceProviderName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Category: <span className="font-medium">{review.serviceCategory}</span>
                  </p>

                  <div className="bg-blue-50 p-3 rounded-lg mt-2 shadow-inner">
                    <p className="text-gray-700 text-sm mb-2">"{review.reviewText}"</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">⭐ {review.stars} Stars</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Pos: {review.pos}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">Neu: {review.neu}</span>
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded">Neg: {review.neg}</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Compound: {review.compound}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-600">No feedbacks found.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewFeedbacks;