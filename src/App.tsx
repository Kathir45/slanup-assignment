import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Loader2, AlertCircle, Navigation, ArrowUpDown, LogOut, User, MapPin } from 'lucide-react';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';
import { CreateEventModal } from './components/CreateEventModal';
import { EditEventModal } from './components/EditEventModal';
import { eventService } from './services/eventService';
import type { Event } from './types/database.types';
import type { CreateEventData } from './services/eventService';
import { useGeolocation } from './hooks/useGeolocation';
import { calculateDistance } from './utils/geolocation';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'full'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const { coordinates, isLoading: isLocationLoading, error: locationError, requestLocation } = useGeolocation();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, locationFilter, sortByDistance, coordinates, availabilityFilter, dateFilter]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
      );
    }

    // Location filter
    if (locationFilter) {
      const location = locationFilter.toLowerCase();
      filtered = filtered.filter((event) =>
        event.location.toLowerCase().includes(location)
      );
    }

    // Availability filter
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter((event) => {
        const isFull = event.currentParticipants >= event.maxParticipants;
        return availabilityFilter === 'available' ? !isFull : isFull;
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        return dateFilter === 'upcoming' ? eventDate > now : eventDate <= now;
      });
    }

    // Sort by distance
    if (sortByDistance && coordinates) {
      filtered = filtered
        .filter((event) => event.latitude && event.longitude)
        .sort((a, b) => {
          const distA = calculateDistance(coordinates, {
            latitude: a.latitude!,
            longitude: a.longitude!,
          });
          const distB = calculateDistance(coordinates, {
            latitude: b.latitude!,
            longitude: b.longitude!,
          });
          return distA - distB;
        });
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async (data: CreateEventData) => {
    try {
      setError(null);
      await eventService.createEvent(data);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      setError(null);
      const updatedEvent = await eventService.joinEvent(eventId);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updatedEvent : e))
      );
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
      throw err;
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      setError(null);
      const updatedEvent = await eventService.leaveEvent(eventId);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updatedEvent : e))
      );
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave event');
      throw err;
    }
  };

  const handleUpdateEvent = async (eventId: string, data: Partial<CreateEventData>) => {
    try {
      setError(null);
      const updatedEvent = await eventService.updateEvent(eventId, data);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? updatedEvent : e))
      );
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(updatedEvent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setError(null);
      await eventService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    }
  };

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) > new Date()
  );
  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) <= new Date()
  );

  // Show events dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-3">
                Discover Events
              </h1>
              <p className="text-lg text-slate-600">
                Find and join amazing events in your area
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
                <User className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
              <button
                onClick={() => navigate('/nearby')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
              >
                <MapPin className="w-5 h-5" />
                Nearby Events
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Availability Filter */}
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as 'all' | 'available' | 'full')}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Events</option>
                <option value="available">Available</option>
                <option value="full">Full</option>
              </select>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-all focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>

              {!coordinates && (
                <button
                  onClick={requestLocation}
                  disabled={isLocationLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 font-medium rounded-lg hover:bg-sky-200 disabled:bg-slate-100 disabled:text-slate-400 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  {isLocationLoading ? 'Getting location...' : 'Enable Location'}
                </button>
              )}

              {coordinates && (
                <button
                  onClick={() => setSortByDistance(!sortByDistance)}
                  className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
                    sortByDistance
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {sortByDistance ? 'Sorted by distance' : 'Sort by distance'}
                </button>
              )}

              {locationError && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {locationError}
                </div>
              )}

              {coordinates && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-sm rounded-lg">
                  <Navigation className="w-4 h-4" />
                  Location enabled
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-600 font-medium">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No events found
            </h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || locationFilter
                ? 'Try adjusting your filters'
                : 'Be the first to create an event!'}
            </p>
            {!searchQuery && !locationFilter && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-600/30"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Upcoming Events
                  <span className="ml-3 text-lg font-normal text-slate-500">
                    ({upcomingEvents.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      userLocation={coordinates}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Past Events
                  <span className="ml-3 text-lg font-normal text-slate-500">
                    ({pastEvents.length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEvent(event)}
                      currentUserId={user?.id}
                      userLocation={coordinates}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoin={handleJoinEvent}
          onLeave={handleLeaveEvent}
          onEdit={(event) => {
            setEditingEvent(event);
            setSelectedEvent(null);
          }}
          onDelete={handleDeleteEvent}
          currentUserId={user?.id}
        />
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateEvent}
        />
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleUpdateEvent}
        />
      )}
    </div>
  );
}

export default App;
