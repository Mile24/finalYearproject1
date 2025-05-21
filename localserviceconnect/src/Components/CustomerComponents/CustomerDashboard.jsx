import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMapPin,   FiTruck, FiSearch, FiAward, FiPhone } from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';
import Img1 from '../Images/Img1.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const CustomerDashBoard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [customerData, setCustomerData] = useState(null);
  
  const email = sessionStorage.getItem("customerEmail");
  
  const serviceCategories = [
    { id: 1, name: "Plumbing", icon: "🔧", color: "bg-blue-100" },
    { id: 2, name: "Electrical", icon: "⚡", color: "bg-yellow-100" },
    { id: 3, name: "Cleaning", icon: "🧹", color: "bg-green-100" },
    { id: 4, name: "Gardening", icon: "🌱", color: "bg-emerald-100" },
    { id: 5, name: "Moving", icon: "📦", color: "bg-orange-100" },
    { id: 6, name: "Painting", icon: "🎨", color: "bg-purple-100" },
    { id: 7, name: "Carpentry", icon: "🪚", color: "bg-amber-100" },
    { id: 8, name: "Appliance Repair", icon: "🔌", color: "bg-red-100" }
  ];

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (email) {
        try {
          const response = await axios.get(`http://localhost:8082/api/customer/getDetails/${email}`);
          setCustomerData(response.data);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      }
    };

    fetchCustomerData();
  
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'findServices', 'trackServices', 'feedback'];
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
  }, [email]);

  const navigate = useNavigate();

  const handleFindServices = () => {
    navigate('/findServices')
  };

  const navLinkClass = (section) =>
    `${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-600 transition`;

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
            <a href="/customerDB" className={navLinkClass('home')}>Home</a>
            <a href="/findServices" className={navLinkClass('findServices')}>FindServices</a>
            <a href="/trackServices" className={navLinkClass('trackServices')}>TrackServices</a>
            <a href="/feedback" className={navLinkClass('feedback')}>Feedback</a>
            <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className={`py-2 text-left w-full ${navLinkClass('logout')}`}
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
              <a href="/customerDB" className={`py-2 ${navLinkClass('home')}`}>Home</a>
              <a href="/findServices" className={`py-2 ${navLinkClass('findServices')}`}>FindServices</a>
              <a href="/trackServices" className={`py-2 ${navLinkClass('trackServices')}`}>TrackServices</a>
              <a href="/feedback" className={`py-2 ${navLinkClass('feedback')}`}>Feedback</a>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className={`py-2 text-left w-full ${navLinkClass('logout')}`}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 pt-28 md:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">Welcome, {customerData?.fullName || email?.split('@')[0] || "Customer"}!</h1>
              <p className="text-lg text-gray-700 mb-6">Find trusted local service providers for all your needs with just a few clicks.</p>
              <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <FiMapPin className="text-blue-600 mr-2" />
                <p className="text-gray-800">
                  {customerData?.address ? 
                    `Services available near: ${customerData.address.split(',').slice(0, 2).join(',')}...` :
                    "Update your profile to see services in your area"}
                </p>
              </div>
              <div className="mt-8">
                <button 
                  onClick={handleFindServices}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md inline-flex items-center"
                >
                  <FiSearch className="mr-2" />
                  Find Services Now
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src={Img1} alt="Local Service Connect" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Our Service Categories</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Explore our wide range of services provided by verified professionals in your area
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceCategories.map(category => (
              <div key={category.id} className="flex flex-col items-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-2xl mb-3`}>
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a href="/findServices" className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800 transition">
              View All Services
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>
      <section className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Get the service you need in just a few easy steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                <FiSearch />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. Find</h3>
              <p className="text-gray-600">Search for services available in your area based on your needs</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                <FiAward />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. Book</h3>
              <p className="text-gray-600">Select from verified providers and schedule at your convenience</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                <FiTruck />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. Receive</h3>
              <p className="text-gray-600">Get professional service at your doorstep and pay securely</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">Need Help with Your Service?</h2>
                <p className="text-white text-opacity-90 mb-6">
                  Our customer support team is ready to assist you 24/7 with any questions or concerns.
                </p>
              </div>
              <div>
                <a href="/customerDB" className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-md">
                  <FiPhone className="mr-2" />
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                  <img src={MainLogo} alt="LSC" style={{ width: "28px", height: "35px", borderRadius: "30%" }} />
                </div>
                <h2 className="ml-3 text-xl font-bold text-white">LocalServiceConnect</h2>
              </div>
              <p className="text-gray-400 max-w-sm">
                Connecting customers with trusted local service providers for all your home and business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/findServices" className="text-gray-400 hover:text-white transition">Find Services</a></li>
                  <li><a href="/trackServices" className="text-gray-400 hover:text-white transition">Track Services</a></li>
                  <li><a href="/feedback" className="text-gray-400 hover:text-white transition">Feedback</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} LocalServiceConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerDashBoard;