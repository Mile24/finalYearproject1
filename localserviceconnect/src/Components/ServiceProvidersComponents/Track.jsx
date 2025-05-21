import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarSP from './NavbarSP';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

function Track() {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      const email = sessionStorage.getItem('serviceProviderEmail');
      if (!email) {
        setError('No service provider email found. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8082/api/serviceRequest/provider/${email}`);
        setServiceRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch service requests');
        setLoading(false);
        console.error('Error fetching service requests:', err);
      }
    };

    fetchServiceRequests();
  }, []);

  const handleShowRoute = (request) => {
    setMapLoading(true);
    setSelectedRequest(request);
    setShowMap(true);
    // Small delay to ensure modal is visible before map initialization
    setTimeout(() => setMapLoading(false), 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavbarSP />
      
      <div className="container mx-auto px-4 py-8 mt-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center pt-6">
          Service Requests Tracking
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative my-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : serviceRequests.length === 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-6 py-4 rounded-lg relative my-6" role="alert">
            <span className="block sm:inline">No service requests found.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{request.customerName}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.customerAcceptanceStatus === null ? 
                        "Waiting for customer approval" : 
                        request.customerAcceptanceStatus
                      }
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-32">Problem:</span>
                      <span className="text-gray-700">{request.problemCategory}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-32">Description:</span>
                      <span className="text-gray-700">{request.problemDescription}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-32">Email:</span>
                      <span className="text-gray-700">{request.customerEmail}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-32">Created:</span>
                      <span className="text-gray-700">{formatDate(request.createdTime)}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 font-medium w-32">Service Charge:</span>
                      <span className="text-gray-700 font-bold">₹{request.serviceCharge}</span>
                    </div>
                  </div>
                  {request.customerAcceptanceStatus === "OK" ? (
                    <button
                      onClick={() => handleShowRoute(request)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-300 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Show Route
                    </button>
                  ) : (
                    <p className="text-red-500 font-medium text-center py-2">Waiting for customer approval...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showMap && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-full overflow-hidden">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-xl font-semibold text-gray-800">Route to Customer Location</h3>
                <button 
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                {mapLoading ? (
                  <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading map...</p>
                    </div>
                  </div>
                ) : (
                  <LeafletMap
                    providerLat={selectedRequest.providerLatitude}
                    providerLng={selectedRequest.providerLongitude}
                    customerLat={selectedRequest.customerLatitude}
                    customerLng={selectedRequest.customerLongitude}
                    providerName={selectedRequest.providerName}
                    customerName={selectedRequest.customerName}
                  />
                )}
              </div>
              
              <div className="border-t p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-medium">From:</p>
                    <p className="text-gray-800 font-bold">{selectedRequest.providerName}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Lat: {selectedRequest.providerLatitude.toFixed(6)}, Lng: {selectedRequest.providerLongitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-medium">To:</p>
                    <p className="text-gray-800 font-bold">{selectedRequest.customerName}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Lat: {selectedRequest.customerLatitude.toFixed(6)}, Lng: {selectedRequest.customerLongitude.toFixed(6)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-600 font-medium">Journey Details:</p>
                    <div className="flex justify-between mt-1">
                      <div>
                        <span className="text-xs text-gray-500">Distance:</span>
                        <p id="route-distance" className="font-bold text-blue-600">Calculating...</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">ETA:</span>
                        <p id="route-duration" className="font-bold text-blue-600">Calculating...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Improved Leaflet Map Component
function LeafletMap({ providerLat, providerLng, customerLat, customerLng, providerName, customerName }) {
  useEffect(() => {
    // Preload map assets to improve performance
    const preloadMapAssets = async () => {
      const iconUrls = [
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
      ];
      
      // Preload images
      await Promise.all(iconUrls.map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.src = url;
        });
      }));
    };

    // Initialize map immediately after preloading assets
    const initMap = async () => {
      await preloadMapAssets();
      
      // Fix Leaflet's icon paths issue with webpack
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Create custom icons with distinct colors
      const providerIcon = L.divIcon({
        html: `
          <div style="background-color: #2563eb; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <span style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: rgba(37, 99, 235, 0.9); color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; white-space: nowrap;">You</span>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [12, 12],
      });

      const customerIcon = L.divIcon({
        html: `
          <div style="background-color: #e11d48; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
            <span style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: rgba(225, 29, 72, 0.9); color: white; padding: 3px 8px; border-radius: 4px; font-weight: bold; white-space: nowrap;">Customer</span>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [12, 12],
      });

      // Initialize map with better rendering performance
      const map = L.map('leaflet-map', {
        preferCanvas: true, // Better performance for large datasets
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false, // Remove attribution for cleaner look
      }).setView([(providerLat + customerLat) / 2, (providerLng + customerLng) / 2], 13);

      // Add tile layer (map style) - using a more detailed map source
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add markers with enhanced popups
      const providerMarker = L.marker([providerLat, providerLng], { icon: providerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <b style="font-size: 14px;">${providerName}</b>
            <p style="margin: 5px 0; font-size: 12px;">Service Provider</p>
            <p style="margin: 0; font-size: 11px; color: #666;">Your current location</p>
          </div>
        `, {
          closeButton: false,
          className: 'custom-popup'
        });

      const customerMarker = L.marker([customerLat, customerLng], { icon: customerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <b style="font-size: 14px;">${customerName}</b>
            <p style="margin: 5px 0; font-size: 12px;">Customer</p>
            <p style="margin: 0; font-size: 11px; color: #666;">Destination</p>
          </div>
        `, {
          closeButton: false,
          className: 'custom-popup'
        });

      // Open popups initially
      providerMarker.openPopup();
      setTimeout(() => {
        customerMarker.openPopup();
      }, 300);

      // Calculate and show the route with better styling
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(providerLat, providerLng),
          L.latLng(customerLat, customerLng)
        ],
        routeWhileDragging: false,
        showAlternatives: true,
        fitSelectedRoutes: true,
        lineOptions: {
          styles: [
            { color: '#3b82f6', weight: 6, opacity: 0.7 }
          ]
        },
        altLineOptions: {
          styles: [
            { color: '#64748b', weight: 4, opacity: 0.5, dashArray: '10, 10' }
          ]
        },
        createMarker: function() { return null; }, // Disable default route markers
        addWaypoints: false, // Prevent users from adding waypoints
        draggableWaypoints: false, // Prevent users from dragging waypoints
      }).addTo(map);

      // Remove unnecessary controls from the Routing control
      routingControl.on('routesfound', function(e) {
        const container = routingControl.getContainer();
        const routesContainer = container.querySelector('.leaflet-routing-container');
        
        // Hide the route instructions container for cleaner UI
        if (routesContainer) {
          routesContainer.style.display = 'none';
        }
        
        const routes = e.routes;
        const summary = routes[0].summary;
        
        // Format and update distance and duration elements
        document.getElementById('route-distance').textContent = `${(summary.totalDistance / 1000).toFixed(2)} km`;
        document.getElementById('route-duration').textContent = formatDuration(summary.totalTime);
      });

      // Add direct line between points (as the crow flies)
      const straightLine = L.polyline(
        [[providerLat, providerLng], [customerLat, customerLng]],
        {
          color: '#d1d5db',
          weight: 2,
          opacity: 0.5,
          dashArray: '5, 10',
        }
      ).addTo(map);

      // Create a better fitting bounds that includes some padding
      const bounds = L.latLngBounds([
        [providerLat, providerLng],
        [customerLat, customerLng]
      ]);
      
      // Fit bounds with better padding
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 15 // Prevent zooming in too much
      });

      // Add custom control for centering the map
      L.Control.Center = L.Control.extend({
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
          const button = L.DomUtil.create('a', 'center-button', container);
          button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 16px; height: 16px;"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" /></svg>';
          button.title = 'Center Map';
          button.style.fontWeight = 'bold';
          button.style.fontSize = '18px';
          button.href = '#';
          
          L.DomEvent.on(button, 'click', function(e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            map.fitBounds(bounds, { padding: [50, 50] });
          });
          
          return container;
        }
      });
      
      new L.Control.Center({ position: 'topleft' }).addTo(map);
    };

    initMap();

    // Cleanup function
    return () => {
      const mapContainer = document.getElementById('leaflet-map');
      if (mapContainer && mapContainer._leaflet_id) {
        mapContainer._leaflet_id = null;
      }
    };
  }, [providerLat, providerLng, customerLat, customerLng, providerName, customerName]);

  // Helper function to format duration in seconds to minutes/hours
  const formatDuration = (seconds) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours} hr ${minutes} min`;
    }
  };

  return (
    <div className="space-y-4">
      <div id="leaflet-map" className="w-full h-96 rounded-lg shadow-inner border-2 border-gray-300"></div>
      
      {/* Map legend */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-xs text-gray-500 mb-2">Map Legend:</div>
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-sm">Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-sm">Customer Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-blue-500 mr-2"></div>
            <span className="text-sm">Route</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-1 bg-gray-300 border-dashed border-t border-gray-400 mr-2"></div>
            <span className="text-sm">Direct Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Track;