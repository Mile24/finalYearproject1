import React, { useState, useEffect } from 'react';
import { FiMenu, FiSearch, FiX, FiUser, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';
import './Style.css';

const ViewCustomers = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('viewCustomers');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // Background colors for customer cards (for visual variety)
  const bgColors = [
    'bg-gradient-to-br from-blue-50 to-indigo-50',
    'bg-gradient-to-br from-purple-50 to-pink-50',
    'bg-gradient-to-br from-green-50 to-emerald-50',
    'bg-gradient-to-br from-orange-50 to-amber-50',
    'bg-gradient-to-br from-cyan-50 to-sky-50',
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:8082/api/customer/getallCustomers')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch customers');
        }
        return res.json();
      })
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching customers:', err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'viewCustomers', 'viewServiceProviders', 'viewFeedbacks'];
      let currentSection = 'viewCustomers';

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
    `${
      activeSection === section 
        ? 'text-blue-600 font-bold relative after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-blue-600' 
        : 'text-gray-600'
    } hover:text-blue-600 transition duration-300 px-1 py-2`;

  return (
    <div className="font-sans min-h-screen overflow-x-hidden w-full bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg py-3' 
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl transform transition-transform group-hover:scale-110">
              <img 
                src={MainLogo} 
                alt="LSC" 
                className="w-7 h-9 rounded-3xl transition-all duration-300" 
              />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
              LocalServiceConnect
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/adminDB" className={navLinkClass('home')}>Home</a>
            <a href="/viewCustomers" className={navLinkClass('viewCustomers')}>View Customers</a>
            <a href="/viewServiceProviders" className={navLinkClass('viewServiceProviders')}>View Providers</a>
            <a href="/viewFeedbacks" className={navLinkClass('viewFeedbacks')}>View Feedbacks</a>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-md"
            >
              Logout
            </button>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-600 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-xl absolute top-full left-0 w-full transform transition-transform duration-300">
            <div className="flex flex-col px-4 py-3">
              <a href="/adminDB" className={`py-3 border-b border-gray-100 ${navLinkClass('home')}`}>Home</a>
              <a href="/viewCustomers" className={`py-3 border-b border-gray-100 ${navLinkClass('viewCustomers')}`}>View Customers</a>
              <a href="/viewServiceProviders" className={`py-3 border-b border-gray-100 ${navLinkClass('viewServiceProviders')}`}>View Providers</a>
              <a href="/viewFeedbacks" className={`py-3 border-b border-gray-100 ${navLinkClass('viewFeedbacks')}`}>View Feedbacks</a>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className="mt-3 py-2 bg-red-500 text-white font-semibold rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
      
      <section className="pt-32 px-4 md:px-6 pb-16" id="viewCustomers">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10 flex-col sm:flex-row">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">All Registered Customers</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
            
            <div className="relative w-full sm:w-96 mt-6 sm:mt-0">
              <input
                type="text"
                placeholder="Search by name or email"
                className="w-full border border-gray-300 rounded-full py-3 px-5 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-4 top-3.5 text-blue-500" size={20} />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-medium">Error loading customers</p>
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <div 
                    key={customer.id} 
                    className={`${bgColors[index % bgColors.length]} rounded-xl border border-gray-100 shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group overflow-hidden relative`}
                  >
                    <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="flex items-start mb-4">
                      <div className="bg-white p-3 rounded-full shadow-md mr-4 group-hover:scale-110 transition-transform duration-300">
                        <FiUser className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-blue-700 mb-1 group-hover:text-blue-800 transition-colors">{customer.fullName}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <FiMail className="mr-1" />
                          <p>{customer.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3 text-gray-700">
                      <div className="flex items-start">
                        <FiMapPin className="text-gray-500 mt-1 mr-2" />
                        <p><span className="font-medium">Address:</span> {customer.address || 'Not provided'}</p>
                      </div>
                      <div className="flex items-center">
                        <FiPhone className="text-gray-500 mr-2" />
                        <p><span className="font-medium">Phone:</span> {customer.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button 
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        onClick={() => alert(`View details for ${customer.fullName}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <FiSearch className="text-gray-400 mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No customers found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          )}
          
          {filteredCustomers.length > 0 && (
            <div className="mt-8 text-center text-gray-500">
              Showing {filteredCustomers.length} of {customers.length} customers
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewCustomers;