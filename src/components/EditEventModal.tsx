import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Save, Loader2, Navigation2 } from 'lucide-react';
import type { Event } from '../types/database.types';
import type { CreateEventData } from '../services/eventService';
import { geocodeLocation } from '../utils/geocoding';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onSave: (eventId: string, data: Partial<CreateEventData>) => Promise<void>;
}

export function EditEventModal({ event, onClose, onSave }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [date, setDate] = useState(event.date.slice(0, 16)); // Format for datetime-local input
  const [maxParticipants, setMaxParticipants] = useState(event.maxParticipants);
  const [latitude, setLatitude] = useState<number | null>(event.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(event.longitude || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  // Auto-geocode location
  useEffect(() => {
    if (!location || location === event.location) return;

    const timer = setTimeout(async () => {
      setIsGeocoding(true);
      setGeocodingError(null);
      try {
        const result = await geocodeLocation(location);
        if (result) {
          setLatitude(result.latitude);
          setLongitude(result.longitude);
        } else {
          setGeocodingError('Location not found. Please try a different search.');
        }
      } catch (error) {
        setGeocodingError('Failed to geocode location');
      } finally {
        setIsGeocoding(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [location, event.location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSave(event.id, {
        title,
        description,
        location,
        date: new Date(date).toISOString(),
        maxParticipants,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Edit Event</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                required
                maxLength={2000}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="e.g., San Francisco, CA"
                  required
                  maxLength={200}
                />
                {isGeocoding && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                  </div>
                )}
              </div>
              {geocodingError && (
                <p className="mt-2 text-sm text-red-600">{geocodingError}</p>
              )}
              {latitude && longitude && !isGeocoding && (
                <div className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                  <Navigation2 className="w-4 h-4" />
                  <span>Location found: {latitude.toFixed(4)}, {longitude.toFixed(4)}</span>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="datetime-local"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-slate-700 mb-2">
                Maximum Participants *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  id="maxParticipants"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(Number(e.target.value))}
                  min={event.currentParticipants}
                  max={10000}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Current participants: {event.currentParticipants}. Cannot be less than this number.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
