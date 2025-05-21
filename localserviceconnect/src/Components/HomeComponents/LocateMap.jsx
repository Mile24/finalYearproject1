import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Loader, Move, ZoomIn, ZoomOut, Locate } from 'lucide-react';

function LocationMap({ 
  latitude, 
  longitude, 
  isLoading, 
  userType, 
  onLocationChange, 
  draggable = true,
  showControls = true 
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({ lat: latitude, lng: longitude });

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => initializeMap();
      document.body.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (latitude !== currentPosition.lat || longitude !== currentPosition.lng) {
      setCurrentPosition({ lat: latitude, lng: longitude });
      updateMapLocation();
    }
  }, [latitude, longitude]);

  const initializeMap = () => {
    if (!window.L || !mapRef.current || mapInstanceRef.current) return;
    
    // Set default view for map initialization
    const defaultLat = latitude ? parseFloat(latitude) : 40.7128;
    const defaultLng = longitude ? parseFloat(longitude) : -74.0060;
    
    // Initialize map with better drag options
    mapInstanceRef.current = window.L.map(mapRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      dragging: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      touchZoom: true
    });
    
    // Add event listeners for better drag interaction
    mapInstanceRef.current.on('dragstart', () => setIsDragging(true));
    mapInstanceRef.current.on('dragend', handleMapDragEnd);
    mapInstanceRef.current.on('moveend', handleMapMoveEnd);
    
    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    
    // Add marker if coordinates exist
    if (latitude && longitude) {
      addMarker(defaultLat, defaultLng);
    }
  };

  const addMarker = (lat, lng) => {
    if (!window.L || !mapInstanceRef.current) return;
    
    // Remove existing marker if any
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }
    
    const markerColor = userType === 'customer' ? 'text-blue-600' : 'text-green-600';
    
    // Create a custom icon
    const customIcon = window.L.divIcon({
      html: `<div class="${markerColor}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });
    const markerOptions = { 
      icon: customIcon,
      draggable: draggable
    };
    
    markerRef.current = window.L.marker([lat, lng], markerOptions).addTo(mapInstanceRef.current);
    
    if (draggable) {
      markerRef.current.on('dragstart', () => setIsDragging(true));
      markerRef.current.on('dragend', handleMarkerDragEnd);
    }
  };

  const handleMarkerDragEnd = (e) => {
    setIsDragging(false);
    const marker = e.target;
    const position = marker.getLatLng();
    setCurrentPosition({ lat: position.lat, lng: position.lng });
    
    if (onLocationChange) {
      onLocationChange(position.lat, position.lng);
    }
  };
  
  const handleMapDragEnd = () => {
    setIsDragging(false);
    handleMapMoveEnd();
  };
  
  const handleMapMoveEnd = () => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    
    const center = mapInstanceRef.current.getCenter();
    if (draggable) {
      markerRef.current.setLatLng(center);
      setCurrentPosition({ lat: center.lat, lng: center.lng });
      
      if (onLocationChange) {
        onLocationChange(center.lat, center.lng);
      }
    }
  };
  
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };
  
  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            addMarker(latitude, longitude);
          }
          
          if (onLocationChange) {
            onLocationChange(latitude, longitude);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const updateMapLocation = () => {
    if (!window.L || !mapInstanceRef.current) return;
    
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      
      if (isDragging) return;
      
      mapInstanceRef.current.setView([lat, lng], 15, {
        animate: true,
        duration: 0.5
      });
      
      addMarker(lat, lng);
    }
  };

  return (
    <div className="relative w-full  rounded-lg overflow-hidden shadow-md" style={{height:'500px',width:"100%"}}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin text-blue-600 mb-2" />
            <span className="text-sm font-medium">Loading map...</span>
          </div>
        </div>
      )}
      
      {!latitude || !longitude ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center text-gray-500">
            <MapPin size={32} className="mb-2" />
            <span className="text-sm font-medium">Location unavailable</span>
          </div>
        </div>
      ) : null}
      <div 
        ref={mapRef} 
        className="w-full h-full"
      />
      
      {showControls && (
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
          <button 
            onClick={handleZoomIn}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button 
            onClick={handleLocateUser}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Find my location"
          >
            <Locate size={18} />
          </button>
        </div>
      )}
      
      {isDragging && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full z-20 flex items-center">
          <Move size={16} className="mr-2" />
          <span className="text-sm font-medium">Dragging</span>
        </div>
      )}
    </div>
  );
}

export default LocationMap;