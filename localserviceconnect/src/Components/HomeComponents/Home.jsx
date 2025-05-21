import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMapPin, FiStar, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MainLogo from '../Images/MainLogo.png';
import Img6 from '../Images/Img6.jpg';
import Rev1 from '../Images/Rev1.png';
import Rev2 from '../Images/Rev2.png';
import Rev3 from '../Images/Rev3.png';


const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 120,
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'features', 'reviews', 'contact'];
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
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Refresh AOS when component updates
  useEffect(() => {
    AOS.refresh();
  });

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

  const reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Found an electrician within minutes! The service was excellent and the app made everything so simple.',
      image: `${Rev1}`,
      profession: 'Homeowner',
    },
    {
      name: 'Michael Chen',
      rating: 4,
      comment: 'Very reliable plumbers on this platform. The booking process is smooth and the feedback system helps choose the best professionals.',
      image: `${Rev2}`,
      profession: 'Business Owner',
    },
    {
      name: 'Jessica Williams',
      rating: 5,
      comment: "I've used ServiceConnect multiple times for different home repairs. Always satisfied with the quality of service.",
      image: `${Rev3}`,
      profession: 'Apartment Resident',
    },
  ];
  return (
    <div className="font-sans min-h-screen overflow-x-hidden w-full">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
              <img src={MainLogo} alt="LSC" style={{ width: "28px", height: "35px", borderRadius: "30%" }} />
            </div>
            <h1 className="ml-3 text-xl font-bold" style={{ color: "#161179" }}>LocalServiceConnect</h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#home" className={navLinkClass('home')}>Home</a>
            <a href="#services" className={navLinkClass('services')}>Services</a>
            <a href="#features" className={navLinkClass('features')}>Features</a>
            <a href="#reviews" className={navLinkClass('reviews')}>Reviews</a>
            <a href="#contact" className={navLinkClass('contact')}>Contact</a>
            <a href="/register" className={navLinkClass('register')}>Register</a>
            <a href="/login" className={navLinkClass('login')}>Login</a>
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
              <a href="#reviews" className={`py-2 ${navLinkClass('reviews')}`}>Reviews</a>
              <a href="#contact" className={`py-2 ${navLinkClass('contact')}`}>Contact</a>
              <a href="/register" className={`py-2 ${navLinkClass('register')}`}>Register</a>
            <a href="/login" className={`py-2 ${navLinkClass('login')}`}>Login</a>
            </div>
          </div>
        )}
      </nav>
      <section id="home" className="bg-gradient-to-r from-blue-50 to-teal-50 pt-28 md:pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0" data-aos="fade-right" data-aos-delay="100">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
              Find Trusted Local <span className="text-blue-600">Service Providers</span> Near You
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Connect with verified professionals in your area for electrical, plumbing, mechanical, and home repair services - all within 5km radius.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 md:px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="300">
                Find Services
              </button>
              <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium px-4 md:px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay="500">
                Become a Provider
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end" data-aos="fade-left" data-aos-delay="300">
            <div className="relative max-w-full">
              <div className="absolute -top-6 -left-6 w-32 md:w-64 h-32 md:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-32 md:w-64 h-32 md:h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative">
              <img src={Img6} alt="Service providers" className="rounded-lg shadow-2xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl" style={{width:"85%"}} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our simple process connects you with the right service provider in minutes</p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl transition-transform hover:-translate-y-2 hover:shadow-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Search Service</h3>
              <p className="text-gray-600">Search for the service you need and we'll find providers near you</p>
            </div>

            <div className="h-0 md:h-px w-12 md:w-24 bg-gray-300 mx-auto my-6 md:my-0"></div>

            <div className="text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl transition-transform hover:-translate-y-2 hover:shadow-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Book Provider</h3>
              <p className="text-gray-600">Select a provider based on ratings and availability</p>
            </div>

            <div className="h-0 md:h-px w-12 md:w-24 bg-gray-300 mx-auto my-6 md:my-0"></div>

            <div className="text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay="500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl transition-transform hover:-translate-y-2 hover:shadow-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Service</h3>
              <p className="text-gray-600">Service is completed at your location by the provider</p>
            </div>

            <div className="h-0 md:h-px w-12 md:w-24 bg-gray-300 mx-auto my-6 md:my-0"></div>

            <div className="text-center flex flex-col items-center" data-aos="fade-up" data-aos-delay="700">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl transition-transform hover:-translate-y-2 hover:shadow-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pay & Review</h3>
              <p className="text-gray-600">Make payment and share your valuable feedback</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Connect with qualified professionals for all your service needs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-6 transition-transform  hover:-translate-y-2 hover:shadow-xl hover:bg-[#21bf73]"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
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
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform offers unique features designed to make finding and booking services effortless</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-lg p-6 text-center flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-xl hover:bg-[#a5c422]"
                data-aos="flip-up"
                data-aos-delay={index * 150}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-12 md:py-16 bg-gradient-to-r from-blue-50 to-teal-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Read reviews from customers who have used our platform</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-6 transition-all hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="flex items-center mb-4">
                  <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <p className="text-gray-500 text-sm">{review.profession}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} w-5 h-5`} />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center" data-aos="fade-up" data-aos-delay="300">
            <button className="bg-transparent hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600 font-medium px-6 py-3 rounded-lg transition">
              View All Reviews
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-blue-600">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-8" data-aos="fade-up">Ready to Get Started?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6 md:mb-8" data-aos="fade-up" data-aos-delay="200">
            Join thousands of satisfied customers who find reliable service providers every day.
          </p>
          <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="400">
            <button className="bg-white text-blue-600 hover:bg-blue-50 font-medium px-6 md:px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition">
              Find a Service Provider
            </button>
            <button className="bg-transparent text-white hover:bg-blue-700 border border-white font-medium px-6 md:px-8 py-3 rounded-lg transition">
              Become a Provider
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div data-aos="fade-right" data-aos-delay="100">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl">
                <img src={MainLogo} alt='LSC' style={{width:"28px",height:"35px",borderRadius:"30%"}} />
                </div>
                <h3 className="ml-3 text-xl font-bold text-white">LocalServiceConnect</h3>
              </div>
              <p className="mb-4">Connecting you with trusted local service providers in your area.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Electrical Services</a></li>
                <li><a href="#" className="hover:text-white transition">Plumbing Services</a></li>
                <li><a href="#" className="hover:text-white transition">Home Repairs</a></li>
                <li><a href="#" className="hover:text-white transition">Mechanical Services</a></li>
                <li><a href="#" className="hover:text-white transition">View All Services</a></li>
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Press & Media</a></li>
                <li><a href="#" className="hover:text-white transition">Partners</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>123 Service Street, Connect City</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@serviceconnect.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 md:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm md:text-base">&copy; 2025 ServiceConnect. All rights reserved.</p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
                <a href="#" className="text-sm md:text-base hover:text-white transition">Privacy Policy</a>
                <a href="#" className="text-sm md:text-base hover:text-white transition">Terms of Service</a>
                <a href="#" className="text-sm md:text-base hover:text-white transition">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;