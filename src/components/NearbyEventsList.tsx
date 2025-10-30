import { MapPin, Users, Calendar, Navigation2 } from 'lucide-react';
import type { Event } from '../types/database.types';
import { formatDistance } from '../utils/geolocation';

interface EventWithDistance extends Event {
  distance: number;
}

interface NearbyEventsListProps {
  events: EventWithDistance[];
  onEventClick: (event: Event) => void;
  isLoading?: boolean;
}

export function NearbyEventsList({ events, onEventClick, isLoading = false }: NearbyEventsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No events found nearby</h3>
        <p className="text-slate-500">Try increasing the search radius or changing your location</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Nearby Events <span className="text-blue-600">({events.length})</span>
        </h2>
        <p className="text-sm text-slate-500">Sorted by distance</p>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-slate-200 hover:border-blue-300 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{event.description}</p>
              </div>
              
              {/* Distance Badge */}
              <div className="ml-4 flex-shrink-0">
                <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-full shadow-lg">
                  <Navigation2 className="w-3.5 h-3.5" />
                  {formatDistance(event.distance)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {event.currentParticipants}/{event.maxParticipants} joined
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 col-span-2">
                <Calendar className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span>{formatEventDate(event.date)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-3 flex items-center gap-2">
              {event.currentParticipants >= event.maxParticipants ? (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Event Full
                </span>
              ) : new Date(event.date) > new Date() ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Registration Open
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                  Past Event
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatEventDate(date: string | Date): string {
  const eventDate = new Date(date);
  const now = new Date();
  const diffInMs = eventDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return `Today at ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffInDays === 1) {
    return `Tomorrow at ${eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffInDays > 0 && diffInDays <= 7) {
    return `In ${diffInDays} days - ${eventDate.toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return eventDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: eventDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
