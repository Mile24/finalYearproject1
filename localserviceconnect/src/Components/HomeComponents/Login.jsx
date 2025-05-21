import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLogin from '../Images/CustomerLogin.avif';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ADMIN');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData;

    if (activeTab === 'ADMIN') {
      const ADMIN_EMAIL = 'admin@gmail.com';
      const ADMIN_PASSWORD = '123';
      if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setLoading(false);
        alert('Login successful as Admin');
        navigate('/adminDB');
      } else {
        setLoading(false);
        setError('Invalid admin credentials');
      }
      return;
    }

    const endpoint =
      activeTab === 'CUSTOMER'
        ? 'http://localhost:8082/api/customer/login'
        : 'http://localhost:8082/api/serviceProvider/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const message = await response.text();
      setLoading(false);

      if (!response.ok) {
        setError(message || 'Login failed. Please check your credentials.');
        return;
      }

      alert(message); 

      if (activeTab === 'CUSTOMER') {
        sessionStorage.setItem('customerEmail', formData.email);
        navigate('/customerDB');
      } else if (activeTab === 'SERVICE_PROVIDER') {
        sessionStorage.setItem('serviceProviderEmail', formData.email);
        navigate('/serviceProviderDB');
      }

    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    }

  };

  const renderTab = (label, value) => (
    <button
      onClick={() => {
        setActiveTab(value);
        setError('');
        setFormData({ email: '', password: '' });
      }}
      className={`relative px-5 py-3 text-sm font-medium transition duration-300 rounded-t-lg 
        ${activeTab === value
          ? 'bg-white text-indigo-700 border-t-2 border-l border-r border-indigo-500 shadow-sm z-10'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-indigo-600'
        }
        focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-300`}
    >
      {label}
      {activeTab === value && <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600"></span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        <img src={CustomerLogin} alt="Login" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/80 to-purple-700/70 flex items-center justify-center">
          <div className="text-center p-8 max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Welcome Back!</h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Sign in to access your account and continue your journey with us.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-blue-800 tracking-tight">
              {activeTab === 'ADMIN' && 'Admin Portal'}
              {activeTab === 'CUSTOMER' && 'Customer Login'}
              {activeTab === 'SERVICE_PROVIDER' && 'Service Provider Login'}
            </h1>
            <p className="mt-3 text-gray-600">
              Access your dashboard and manage your activities
            </p>
          </div>

          <div className="flex justify-center space-x-1">
            {renderTab('Admin', 'ADMIN')}
            {renderTab('Service Provider', 'SERVICE_PROVIDER')}
            {renderTab('Customer', 'CUSTOMER')}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 hover:shadow-lg">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-pulse">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm 
                  ${loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:translate-y-px`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors underline decoration-2 decoration-indigo-300 underline-offset-2">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;