import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLogo from '../Images/MainLogo.png';

const NavbarSP = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const email = sessionStorage.getItem('serviceProviderEmail');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Match path to highlight active link
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `${isActive(path) ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-600 transition`;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
            <img src={MainLogo} alt="LSC" style={{ width: '28px', height: '35px', borderRadius: '30%' }} />
          </div>
          <h1 className="ml-3 text-xl font-bold" style={{ color: '#161179' }}>LocalServiceConnect</h1>
        </div>

        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <a href="/serviceProviderDB" className={navLinkClass('/serviceProviderDB')}>Home</a>
          <a href="/spfeedbacks" className={navLinkClass('/spfeedbacks')}>Feedbacks</a>
          <a href="/trackSP" className={navLinkClass('/trackSP')}>TrackDetails</a>
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
            <a href="/serviceProviderDB" className={`py-2 ${navLinkClass('/serviceProviderDB')}`}>Home</a>
            <a href="/spfeedbacks" className={navLinkClass('/spfeedbacks')}>Feedbacks</a>
            <a href="/trackSP" className={navLinkClass('/trackSP')}>TrackDetails</a>
            <button
              onClick={() => {
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className={`py-2 text-left w-full ${navLinkClass('/logout')}`}
            >
              Logout
            </button>
            <span className="py-2 text-sm text-gray-500">{email}</span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarSP;
