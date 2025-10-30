import { Calendar, MapPin, Users, Navigation, Crown, CheckCircle } from 'lucide-react';
import type { Event } from '../types/database.types';
import type { Coordinates } from '../utils/geolocation';
import { calculateDistance, formatDistance } from '../utils/geolocation';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  userLocation?: Coordinates | null;
  currentUserId?: string | null;
}

export function EventCard({ event, onClick, userLocation, currentUserId }: EventCardProps) {
  const isCreator = currentUserId && event.creatorId === currentUserId;
  const hasJoined = currentUserId && event.participants.includes(currentUserId);
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isFull = event.currentParticipants >= event.maxParticipants;
  const fillPercentage = (event.currentParticipants / event.maxParticipants) * 100;

  const distance =
    userLocation && event.latitude && event.longitude
      ? calculateDistance(userLocation, { latitude: event.latitude, longitude: event.longitude })
      : null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100 hover:border-slate-200"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-sky-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {event.title}
              </h3>
              {isCreator && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  <Crown className="w-3 h-3" />
                  Creator
                </span>
              )}
              {hasJoined && !isCreator && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Joined
                </span>
              )}
            </div>
            <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">
              {event.description}
            </p>
          </div>

          {isFull && (
            <span className="ml-3 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full whitespace-nowrap">
              Full
            </span>
          )}
          {!isFull && isUpcoming && (
            <span className="ml-3 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full whitespace-nowrap">
              Open
            </span>
          )}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-slate-600">
            <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
            <span className="text-sm">{formatDate(eventDate)}</span>
          </div>

          <div className="flex items-center text-slate-600">
            <MapPin className="w-4 h-4 mr-2 text-sky-600" />
            <span className="text-sm">{event.location}</span>
          </div>

          {distance !== null && (
            <div className="flex items-center text-slate-600">
              <Navigation className="w-4 h-4 mr-2 text-rose-600" />
              <span className="text-sm font-medium">{formatDistance(distance)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-700">
              <Users className="w-4 h-4 mr-2 text-slate-500" />
              <span className="font-medium">
                {event.currentParticipants} / {event.maxParticipants} participants
              </span>
            </div>
            <span className="text-xs text-slate-500">{Math.round(fillPercentage)}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPercentage >= 100
                  ? 'bg-red-500'
                  : fillPercentage >= 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
