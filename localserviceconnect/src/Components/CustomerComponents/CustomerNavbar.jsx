// components/Navbar.js

import React, { useState, useEffect } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import MainLogo from '../Images/MainLogo.png';

const CustomerNavbar = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'findServices', 'trackServices', 'feedback'];
      let currentSection = 'findServices';

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
  }, [setActiveSection]);

  const navLinkClass = (section) =>
    `${activeSection === section ? 'text-blue-600 font-semibold' : 'text-gray-600'} hover:text-blue-600 transition`;

  return (
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
  );
};

export default CustomerNavbar;
