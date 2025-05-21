import React, { useState, useEffect } from 'react';
import {
  FiMenu,
  FiSearch,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiChevronDown,
} from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';
import './Style.css';

const ViewServiceProviders = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [expandedProvider, setExpandedProvider] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:8082/api/serviceProvider/getallCustomers')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch providers');
        return res.json();
      })
      .then((data) => {
        setProviders(data);
        setFilteredProviders(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = providers.filter((provider) => {
      const search = searchTerm.toLowerCase();
      return (
        provider.fullName.toLowerCase().includes(search) ||
        provider.email.toLowerCase().includes(search) ||
        provider.serviceCategory?.toLowerCase().includes(search)
      );
    });
    setFilteredProviders(filtered);
  }, [searchTerm, providers]);

  const toggleProviderDetails = (id) => {
    setExpandedProvider(expandedProvider === id ? null : id);
  };

  const renderStarRating = (reviews) => {
    if (!reviews || reviews.length === 0)
      return <p className="text-sm text-gray-500">No ratings yet</p>;

    const average =
      reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
    const fullStars = Math.floor(average);
    const hasHalfStar = average - fullStars >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-300'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {average.toFixed(1)} / 5
        </span>
      </div>
    );
  };

  return (
    <div className="font-sans min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white shadow-lg py-2'
            : 'bg-white/90 backdrop-blur-md py-3'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={MainLogo} alt="Logo" className="w-10 h-10" />
            <h1 className="ml-3 text-xl font-bold text-blue-900">
              LocalServiceConnect
            </h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="/adminDB" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <a
              href="/viewCustomers"
              className="text-gray-600 hover:text-blue-600"
            >
              View Customers
            </a>
            <a
              href="/viewServiceProviders"
              className="text-blue-600 font-bold border-b-2 border-blue-600"
            >
              View Providers
            </a>
            <a
              href="/viewFeedbacks"
              className="text-gray-600 hover:text-blue-600"
            >
              View Feedbacks
            </a>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md px-4 py-2 space-y-2 mt-16">
          <a href="/adminDB" className="block text-gray-600">
            Home
          </a>
          <a href="/viewCustomers" className="block text-gray-600">
            View Customers
          </a>
          <a href="/viewServiceProviders" className="block text-blue-600">
            View Providers
          </a>
          <a href="/viewFeedbacks" className="block text-gray-600">
            View Feedbacks
          </a>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }}
            className="w-full text-left bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-28 pb-16 px-4 max-w-5xl mx-auto">
        <div className="bg-white shadow-md rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
              Service Providers Directory
            </h2>
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by name, email, or category..."
                className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin h-12 w-12 border-t-4 border-blue-500 border-solid rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading service providers...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-xl shadow-md transition hover:shadow-lg"
              >
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => toggleProviderDetails(provider.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {provider.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {provider.serviceCategory}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-blue-600 text-sm">
                        {expandedProvider === provider.id
                          ? 'Hide Details'
                          : 'View Details'}
                      </span>
                      <FiChevronDown
                        className={`ml-2 transition-transform ${
                          expandedProvider === provider.id ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {expandedProvider === provider.id && (
                  <div className="bg-gray-50 border-t border-gray-200 px-5 pb-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Contact Info
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiMail className="mr-2" /> {provider.email}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiPhone className="mr-2" /> {provider.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiMapPin className="mr-2" />
                          Lat: {provider.latitude}, Lng: {provider.longitude}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Rating
                        </h4>
                        {renderStarRating(provider.reviews)}
                        <p className="text-sm text-gray-600 mt-1">
                          {provider.reviews.length} review(s)
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-1">
                          Reviews
                        </h4>
                        {provider.reviews.length > 0 ? (
                          provider.reviews.map((review) => (
                            <div key={review.id} className="mb-2">
                              <p className="text-sm text-gray-600">
                                "{review.reviewText}"
                              </p>
                              <p className="text-xs text-gray-400">
                                ⭐ {review.stars} / 5
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">
                            No reviews yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredProviders.length === 0 && (
              <div className="bg-white p-6 rounded-md shadow text-center text-gray-500">
                No providers match your search.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewServiceProviders;
