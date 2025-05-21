import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

const DefaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function Register() {
  const [activeTab, setActiveTab] = useState('customer');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    address: '',
    coordinates: '',
    phoneNumber: '',
    latitude: '',
    longitude: '',
    serviceCategory: 'Electrician'
  });

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const defaultCenter = [13.0827, 80.2707];

  useEffect(() => {
    if (!mapRef.current) {
      initMap();
    }
  }, []);

  const initMap = () => {
    const map = L.map('leaflet-map').setView(defaultCenter, 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', handleMapClick);
    mapRef.current = map;
  };

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates(lat, lng);
    updateMarker(lat, lng);
    fetchAddress(lat, lng);
  };

  const setCoordinates = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }));
  };

  const updateMarker = (lat, lng) => {
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: DefaultIcon }).addTo(mapRef.current);
    }
    mapRef.current.panTo([lat, lng]);
  };

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data && data.display_name) {
        setFormData(prev => ({ ...prev, address: data.display_name }));
      } else {
        setFormData(prev => ({ ...prev, address: 'Address not found' }));
      }
    } catch (err) {
      console.error("Error fetching address:", err);
      setFormData(prev => ({ ...prev, address: 'Unable to fetch address' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If coordinates are manually entered, update the map
    if (name === 'coordinates') {
      const coordsArray = value.split(',').map(coord => coord.trim());
      if (coordsArray.length === 2) {
        const lat = parseFloat(coordsArray[0]);
        const lng = parseFloat(coordsArray[1]);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          updateMarker(lat, lng);
          fetchAddress(lat, lng);
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }));
        }
      }
    }
    
    // If address is manually entered, just update the form data
    // We don't attempt to geocode the address to get coordinates
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === 'customer'
        ? 'http://localhost:8082/api/customer/register'
        : 'http://localhost:8082/api/serviceProvider/register';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(`Successfully registered as ${activeTab === 'customer' ? 'Customer' : 'Service Provider'}!`);
        window.location.href = '/login';
      } else {
        const error = await res.json();
        alert(error.message || 'Registration failed.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div id="leaflet-map" style={{ height: '100%', width: '100%' }}></div>
      </div>
      <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Welcome...!</h1>
          <p className="text-gray-600 mb-8">Create your account to get started</p>
          <div className="flex mb-8 bg-white rounded-xl p-1 shadow-md">
            <button
              className={`w-1/2 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'customer' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('customer')}
            >
              Customer
            </button>
            <button
              className={`w-1/2 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'provider' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('provider')}
            >
              Service Provider
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-800">
              Register as a {activeTab === 'customer' ? 'Customer' : 'Service Provider'}
            </h2>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input type="text" name="fullName" onChange={handleInputChange} value={formData.fullName}
                       className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                       placeholder="John Doe" required />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <input type="email" name="email" onChange={handleInputChange} value={formData.email}
                       className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                       placeholder="johndoe@example.com" required />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input type="password" name="password" onChange={handleInputChange} value={formData.password}
                       className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                       placeholder="••••••••" required />
              </div>
            </div>
            {activeTab === 'provider' && (
             <div className="mb-5">
             <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="serviceCategory">
               Service Category
             </label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
               </div>
               <select
                 id="serviceCategory"
                 name="serviceCategory"
                 value={formData.serviceCategory}
                 onChange={handleInputChange}
                 className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                 required
               >
                 <option value="Electrician">Electrician</option>
                 <option value="Mechanic">Mechanic</option>
                 <option value="Plumber">Plumber</option>
               </select>
               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                 <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                 </svg>
               </div>
             </div>
           </div>
            )}

            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="coordinates">
                Coordinates (Latitude, Longitude)
                <span className="text-xs text-gray-500 ml-2">Select on map or enter manually</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="coordinates" 
                  onChange={handleInputChange} 
                  value={formData.coordinates}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. 13.0827, 80.2707" 
                />
              </div>
            </div>
            {activeTab === 'customer' && (
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="address">
                Address
                <span className="text-xs text-gray-500 ml-2">Selected location or enter manually</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  name="address" 
                  onChange={handleInputChange} 
                  value={formData.address}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your address or select on map" 
                />
              </div>
            </div>
            )}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input type="tel" name="phoneNumber" onChange={handleInputChange} value={formData.phoneNumber}
                       className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                       placeholder="+1 234 567 8900" required />
              </div>
            </div>

            <button type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {activeTab === 'customer' ? 'Join as Customer' : 'Join as Provider'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?
            <a href="/login" className="text-indigo-600 font-medium ml-1 hover:text-indigo-800 transition-colors">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;