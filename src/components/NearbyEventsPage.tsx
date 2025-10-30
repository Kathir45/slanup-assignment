import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, List, Navigation, Loader2, AlertCircle, X } from 'lucide-react';
import { MapView } from './MapView';
import { NearbyEventsList } from './NearbyEventsList';
import { EventModal } from './EventModal';
import { eventService } from '../services/eventService';
import type { Event } from '../types/database.types';
import { getUserLocation } from '../utils/geolocation';
import { useAuth } from '../contexts/AuthContext';

interface EventWithDistance extends Event {
  distance: number;
}

export function NearbyEventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [view, setView] = useState<'map' | 'list'>('map');
  const [events, setEvents] = useState<EventWithDistance[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [radius, setRadius] = useState(50); // Default 50km
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user's location on mount
    loadUserLocation();
  }, []);

  useEffect(() => {
    // Load nearby events when location or radius changes
    if (userLocation) {
      loadNearbyEvents();
    }
  }, [userLocation, radius]);

  const loadUserLocation = async () => {
    setIsLoading(true);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setError(null);
    } catch (err) {
      console.error('Error getting location:', err);
      // Set default location to San Francisco if permission denied
      setUserLocation({ latitude: 37.7749, longitude: -122.4194 });
      setError(null); // Clear error since we're using default location
    } finally {
      setIsLoading(false);
    }
  };

  const loadNearbyEvents = async () => {
    if (!userLocation) {
      setError('Location not available. Please enable location services.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await eventService.getNearbyEvents(
        userLocation.latitude,
        userLocation.longitude,
        radius
      );

      if (!result || !result.events) {
        throw new Error('Invalid response from server');
      }

      setEvents(result.events);
    } catch (err) {
      console.error('Error loading nearby events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load nearby events');
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const updatedEvent = await eventService.joinEvent(eventId);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...updatedEvent, distance: e.distance } : e))
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to join event');
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const updatedEvent = await eventService.leaveEvent(eventId);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...updatedEvent, distance: e.distance } : e))
      );
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to leave event');
    }
  };

  // Show loading screen while initializing
  if (!userLocation && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading Nearby Events</h2>
          <p className="text-slate-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-7 h-7 text-blue-600" />
                    Nearby Events
                  </h1>
                  <p className="text-sm text-slate-600">
                    {events.length} events within {radius}km
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setView('map')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                      view === 'map'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Map
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                      view === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    List
                  </button>
                </div>

                <button
                  onClick={loadUserLocation}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Navigation className="w-4 h-4" />
                  {isLoading ? 'Locating...' : 'My Location'}
                </button>
              </div>
            </div>

            {/* Radius Slider */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Search Radius:
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-sm font-semibold text-blue-600 w-16 text-right">
                {radius}km
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading && !userLocation ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-slate-600">Loading nearby events...</p>
              </div>
            </div>
          ) : view === 'map' ? (
            <MapView
              events={events}
              onEventClick={setSelectedEvent}
              radius={radius}
              userLocation={userLocation}
              onLocationChange={setUserLocation}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="max-w-5xl mx-auto px-6 py-8">
                <NearbyEventsList
                  events={events}
                  onEventClick={setSelectedEvent}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoin={handleJoinEvent}
          onLeave={handleLeaveEvent}
          currentUserId={user?.id}
        />
      )}

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
