import { useState, FormEvent, useEffect, useCallback } from 'react';
import { X, Calendar, MapPin, Users, FileText, Sparkles, Loader2, MapPinned } from 'lucide-react';
import type { CreateEventData } from '../services/eventService';
import { geocodeLocation, debounce } from '../utils/geocoding';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (data: CreateEventData) => Promise<void>;
}

export function CreateEventModal({ onClose, onCreate }: CreateEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    maxParticipants: '',
    latitude: '',
    longitude: '',
  });

  // Geocode location automatically
  const handleGeocodeLocation = useCallback(
    debounce(async (location: string) => {
      if (!location || location.length < 3) {
        setFormData((prev) => ({ ...prev, latitude: '', longitude: '' }));
        setGeocodingError(null);
        return;
      }

      setIsGeocoding(true);
      setGeocodingError(null);

      try {
        const result = await geocodeLocation(location);
        if (result) {
          setFormData((prev) => ({
            ...prev,
            latitude: result.latitude.toString(),
            longitude: result.longitude.toString(),
          }));
        } else {
          setGeocodingError('Location not found. You can enter coordinates manually.');
        }
      } catch (error) {
        setGeocodingError('Failed to geocode location');
      } finally {
        setIsGeocoding(false);
      }
    }, 800),
    []
  );

  useEffect(() => {
    handleGeocodeLocation(formData.location);
  }, [formData.location, handleGeocodeLocation]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const latitude = formData.latitude ? parseFloat(formData.latitude) : undefined;
      const longitude = formData.longitude ? parseFloat(formData.longitude) : undefined;

      await onCreate({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        maxParticipants: parseInt(formData.maxParticipants, 10),
        latitude,
        longitude,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().slice(0, 16);

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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-2xl">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Create Event</h2>
              <p className="text-slate-600">Share your event with the community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Event Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summer Music Festival"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-sky-600" />
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell people what your event is about..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Central Park, NYC"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Users className="w-4 h-4 text-violet-600" />
                Maximum Participants
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                placeholder="50"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-sky-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      GPS Coordinates
                    </p>
                    <p className="text-xs text-slate-600">
                      {isGeocoding
                        ? 'Auto-detecting from location...'
                        : 'Auto-filled from location or enter manually'}
                    </p>
                  </div>
                </div>
                {isGeocoding && <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />}
              </div>

              {geocodingError && (
                <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">{geocodingError}</p>
                </div>
              )}

              {formData.latitude && formData.longitude && !isGeocoding && (
                <div className="mb-3 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs text-emerald-700">
                    Coordinates set! Distance calculation enabled.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="any"
                    min="-90"
                    max="90"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="Latitude"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    min="-180"
                    max="180"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="Longitude"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40"
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
