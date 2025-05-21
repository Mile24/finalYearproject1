import React, { useState, useEffect } from 'react';
import { FiMenu, FiTrendingUp, FiX, FiMapPin, FiStar, FiClock, FiCheckCircle } from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';
import './Style.css';

const AdminDashBoard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle scroll highlight
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'features', 'viewCustomers', 'viewServiceProviders', 'viewFeedbacks'];
      let currentSection = 'home';

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

  const services = [
    { name: 'Electrical Services', icon: '⚡', description: 'Professional electricians for all your electrical needs' },
    { name: 'Plumbing Services', icon: '🔧', description: 'Expert plumbers ready to solve your plumbing issues' },
    { name: 'Home Repairs', icon: '🏠', description: 'General home repairs and maintenance services' },
    { name: 'Mechanical Services', icon: '⚙️', description: 'Skilled mechanics for vehicle repair and maintenance' },
  ];

  const features = [
    {
      title: 'Location-Based Matching',
      icon: <FiMapPin className="text-blue-500 text-4xl mb-4" />,
      description: 'Find service providers within 5km of your location',
    },
    {
      title: 'Sentiment Analysis',
      icon: <FiStar className="text-blue-500 text-4xl mb-4" />,
      description: 'Make informed decisions with our advanced rating system',
    },
    {
      title: 'Instant Booking',
      icon: <FiClock className="text-blue-500 text-4xl mb-4" />,
      description: 'Book services with just a few clicks',
    },
    {
      title: 'Verified Professionals',
      icon: <FiCheckCircle className="text-blue-500 text-4xl mb-4" />,
      description: 'All service providers are verified and trustworthy',
    },
  ];

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
            <a href="#services" className={navLinkClass('services')}>Services</a>
            <a href="#features" className={navLinkClass('features')}>Features</a>
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
              <a href="#home" className={`py-2 ${navLinkClass('home')}`}>Home</a>
              <a href="#services" className={`py-2 ${navLinkClass('services')}`}>Services</a>
              <a href="#features" className={`py-2 ${navLinkClass('features')}`}>Features</a>
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

      <section id="home" className="pt-28 md:pt-32 pb-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700 animate-pulse">
            Welcome to Admin Dashboard!
          </h1>
        </div>
      </section>
      <section id="services" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Services</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Connect with qualified professionals for all your service needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:-translate-y-2 transition-transform duration-300 hover:shadow-xl hover:bg-[#21bf73]"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
                <button className="mt-4 text-blue-600 font-medium hover:text-blue-800 flex items-center">
                  Book Now <FiTrendingUp className="ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose Us</h2>
            <p className="text-gray-600 max-w-xl mx-auto">Features designed to make finding and booking services effortless</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:-translate-y-2 hover:shadow-xl transition-transform hover:bg-[#a5c422]"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashBoard;
