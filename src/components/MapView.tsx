import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { Navigation, Loader } from 'lucide-react';
import type { Event } from '../types/database.types';
import { getUserLocation, formatDistance } from '../utils/geolocation';

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  radius: number;
  userLocation: { latitude: number; longitude: number } | null;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
}

// Component to update map center when user location changes
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    try {
      map.setView(center, map.getZoom());
    } catch (error) {
      console.error('Error updating map view:', error);
    }
  }, [center, map]);
  return null;
}

export function MapView({ events, onEventClick, radius, userLocation, onLocationChange }: MapViewProps) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Default to San Francisco if no user location
  const defaultCenter: LatLngExpression = [37.7749, -122.4194];
  const center: LatLngExpression = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : defaultCenter;

  const handleGetLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getUserLocation();
      onLocationChange(location);
    } catch (error) {
      console.error('Error getting location:', error);
      alert(error instanceof Error ? error.message : 'Failed to get location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // If there's no location yet, show a loading state
  if (!userLocation) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-slate-50 rounded-2xl">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={{ zIndex: 1 }}>
      {/* Map Container */}
      <MapContainer
        key={`${center[0]}-${center[1]}`}
        center={center}
        zoom={userLocation ? 11 : 5}
        className="h-full w-full rounded-2xl shadow-lg"
        scrollWheelZoom={true}
        style={{ zIndex: 1 }}
      >
        <MapUpdater center={center} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px', color: '#1e293b' }}>
                  📍 Your Location
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Search radius: {radius}km
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {userLocation && (
          <Circle
            center={[userLocation.latitude, userLocation.longitude]}
            radius={radius * 1000}
            pathOptions={{
              color: '#3b82f6',
              fillColor: '#3b82f6',
              fillOpacity: 0.1,
              weight: 2,
            }}
          />
        )}

        {/* Event Markers */}
        {events.map((event) => {
          if (!event.latitude || !event.longitude) return null;

          const eventIcon = new Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: markerShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          });

          return (
            <Marker
              key={event.id}
              position={[event.latitude, event.longitude]}
              icon={eventIcon}
            >
              <Popup maxWidth={300} minWidth={250}>
                <div style={{ minWidth: '200px', padding: '8px' }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#1e293b' }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    📍 {event.location}
                  </p>
                  <p style={{ 
                    fontSize: '12px', 
                    color: '#64748b', 
                    marginBottom: '8px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {event.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: '500' }}>
                      {event.currentParticipants}/{event.maxParticipants} joined
                    </span>
                    {userLocation && (
                      <span style={{ color: '#64748b' }}>
                        {formatDistance(
                          calculateDistanceForEvent(event, userLocation)
                        )} away
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{
                      width: '100%',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      fontSize: '12px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Current Location Button */}
      <button
        onClick={handleGetLocation}
        disabled={isLoadingLocation}
        className="absolute top-4 right-4 z-[1000] bg-white shadow-lg rounded-lg p-3 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Get current location"
      >
        {isLoadingLocation ? (
          <Loader className="w-5 h-5 text-blue-600 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5 text-blue-600" />
        )}
      </button>
    </div>
  );
}

// Helper function to calculate distance
function calculateDistanceForEvent(
  event: Event,
  userLocation: { latitude: number; longitude: number }
): number {
  if (!event.latitude || !event.longitude) return 0;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(event.latitude - userLocation.latitude);
  const dLon = toRad(event.longitude - userLocation.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(userLocation.latitude)) *
      Math.cos(toRad(event.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
