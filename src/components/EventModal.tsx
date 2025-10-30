import { useState } from 'react';
import { X, Calendar, MapPin, Users, UserPlus, UserMinus, Clock, Edit2, Trash2, Crown, CheckCircle, MessageCircle, Info } from 'lucide-react';
import type { Event } from '../types/database.types';
import { EventChat } from './EventChat';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onJoin: (eventId: string) => Promise<void>;
  onLeave: (eventId: string) => Promise<void>;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => Promise<void>;
  currentUserId?: string | null;
}

export function EventModal({ event, onClose, onJoin, onLeave, onEdit, onDelete, currentUserId }: EventModalProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details');

  const isCreator = currentUserId && event.creatorId === currentUserId;
  const hasJoined = currentUserId && event.participants.includes(currentUserId);

  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const isFull = event.currentParticipants >= event.maxParticipants;
  const fillPercentage = (event.currentParticipants / event.maxParticipants) * 100;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await onJoin(event.id);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    try {
      await onLeave(event.id);
    } finally {
      setIsLeaving(false);
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
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{event.title}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {isCreator && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    <Crown className="w-3 h-3" />
                    You Created This Event
                  </span>
                )}
                {hasJoined && !isCreator && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    You Joined This Event
                  </span>
                )}
                {isFull && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Event Full
                  </span>
                )}
                {!isFull && isUpcoming && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    Registration Open
                  </span>
                )}
                {!isUpcoming && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                    Past Event
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Info className="w-4 h-4" />
              Details
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all border-b-2 ${
                activeTab === 'chat'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>

          {activeTab === 'details' ? (
            <>
            <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Date</div>
                  <div className="text-slate-900 font-medium">{formatDate(eventDate)}</div>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 mr-3 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Time</div>
                  <div className="text-slate-900 font-medium">{formatTime(eventDate)}</div>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Location</div>
                  <div className="text-slate-900 font-medium">{event.location}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">About this event</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-sky-50/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-slate-700" />
                  <div>
                    <div className="text-sm font-medium text-slate-500">Participants</div>
                    <div className="text-2xl font-bold text-slate-900">
                      {event.currentParticipants} <span className="text-lg text-slate-500">/ {event.maxParticipants}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-600">{Math.round(fillPercentage)}%</div>
                  <div className="text-xs text-slate-500">capacity</div>
                </div>
              </div>

              <div className="w-full bg-white rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fillPercentage >= 100
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : fillPercentage >= 75
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  }`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {isCreator ? (
              // Creator actions: Edit and Delete
              <>
                <button
                  onClick={() => onEdit && onEdit(event)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
                >
                  <Edit2 className="w-5 h-5" />
                  Edit Event
                </button>

                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
                      setIsDeleting(true);
                      try {
                        if (onDelete) await onDelete(event.id);
                        onClose();
                      } catch (error) {
                        setIsDeleting(false);
                      }
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-red-600 font-semibold rounded-xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  {isDeleting ? 'Deleting...' : 'Delete Event'}
                </button>
              </>
            ) : (
              // Participant actions: Join and Leave
              <>
                <button
                  onClick={handleJoin}
                  disabled={isFull || !isUpcoming || isJoining || Boolean(hasJoined)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40"
                >
                  {hasJoined ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Already Joined
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      {isJoining ? 'Joining...' : 'Join Event'}
                    </>
                  )}
                </button>

                <button
                  onClick={handleLeave}
                  disabled={!hasJoined || isLeaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                >
                  <UserMinus className="w-5 h-5" />
                  {isLeaving ? 'Leaving...' : 'Leave Event'}
                </button>
              </>
            )}
          </div>
          </>
          ) : (
            // Chat Tab
            <div className="h-[60vh]">
              {hasJoined || isCreator ? (
                <EventChat eventId={event.id} eventTitle={event.title} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-lg font-medium">Join this event to access the chat</p>
                    <p className="text-sm mt-2">Only event participants can use the chat feature</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
