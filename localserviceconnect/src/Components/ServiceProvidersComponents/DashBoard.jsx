import React, { useState, useEffect } from 'react';
import MainLogo from '../Images/MainLogo.png';
import PlumblerServices from '../Images/PlumblerServices.png';
import Mechanical from '../Images/Mechanical.avif';
import Plumber from '../Images/Plumber.avif';
import electrician from '../Images/electrician.avif';
import HomeService from '../Images/HomeService.jpg';

const ServiceProviders = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const email = sessionStorage.getItem('serviceProviderEmail');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (section) =>
    `${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-600 transition`;

  return (
    <div className="font-sans min-h-screen overflow-x-hidden w-full">
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
              <img src={MainLogo} alt="LSC" style={{ width: '28px', height: '35px', borderRadius: '30%' }} />
            </div>
            <h1 className="ml-3 text-xl font-bold" style={{ color: '#161179' }}>
              LocalServiceConnect
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="/serviceProviderDB" className={navLinkClass('home')}>
              Home
            </a>
            <a href="/spfeedbacks" className={navLinkClass('feedbacks')}>
              MyFeedbacks
            </a>
            <a href="/trackSP" className={navLinkClass('track')}>
              TrackDetails
            </a>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              Logout
            </button>
            <span className="text-sm text-gray-600 ml-4">{email}</span>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full">
            <div className="flex flex-col px-4 py-2">
              <a href="/serviceProviderDB" className={`py-2 ${navLinkClass('home')}`}>
                Home
              </a>
              <a href="/requests" className={`py-2 ${navLinkClass('requests')}`}>
                My Requests
              </a>
              <a href="/feedbacks" className={navLinkClass('feedbacks')}>
                Feedbacks
              </a>
              <a href="/trackSP" className={navLinkClass('track')}>
                TrackDetails
              </a>
              <button
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = '/';
                }}
                className={`py-2 text-left w-full ${navLinkClass('logout')}`}
              >
                Logout
              </button>
              <span className="py-2 text-sm text-gray-500">{email}</span>
            </div>
          </div>
        )}
      </nav>

      {/* ✅ Hero Section with Plumber Image and Content */}
      <section id="home" className="pt-28 md:pt-25 pb-12 bg-white">
        <div className="container mx-auto px-4 text-center md:flex items-center gap-10">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src={PlumblerServices}
              alt="Service Work"
              className="rounded-lg shadow-md w-full object-cover"
            />
          </div>
          <div className="md:w-1/2 text-left">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Delivering Quality Services to Local Homes</h2>
            <p className="text-gray-600 text-lg mb-4">
              As a dedicated service provider, you play a crucial role in helping households solve everyday issues — whether it's plumbing, electrical work, or any skilled trade.
            </p>
            <p className="text-gray-600 text-lg mb-6">
              Use this dashboard to manage service requests, respond to customer feedback, and track your service records in real-time. We're here to support your journey in making local communities better.
            </p>
            <a
              href="/requests"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition"
            >
              Go to Service Requests
            </a>
          </div>
        </div>
      </section>

      {/* 💼 Services We Offer Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">Services We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <img src={Mechanical} alt="Mechanical" className="h-40 rounded-md mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Mechanical Services</h3>
              <p className="text-gray-600 text-sm">
                Providing maintenance and repair of machinery, HVAC, and industrial equipment with precision.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <img src={Plumber} alt="Plumber" className="h-40 rounded-md mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Plumbing Services</h3>
              <p className="text-gray-600 text-sm">
                Expert solutions for leakages, installations, and plumbing emergencies with guaranteed satisfaction.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <img src={electrician} alt="Electrician" className="h-40 rounded-md mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Electrical Services</h3>
              <p className="text-gray-600 text-sm">
                Safe and reliable electrical repairs, wiring, and fixture installations by certified professionals.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-2xl transition">
              <img src={HomeService} alt="HomeService" className="h-40 rounded-md mb-4 object-cover" />
              <h3 className="text-xl font-semibold text-blue-700 mb-2">Home Care Services</h3>
              <p className="text-gray-600 text-sm">
                Cleaning, appliance repair, and everyday support to maintain a comfortable and functioning home.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceProviders;
