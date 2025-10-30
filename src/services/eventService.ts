import type { Event } from '../types/database.types';
import { authService } from './authService';

const API_BASE_URL = '/api';

export interface CreateEventData {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  latitude?: number;
  longitude?: number;
}

export interface EventFilters {
  location?: string;
  searchQuery?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = authService.getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const eventService = {
  async createEvent(data: CreateEventData): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        location: data.location,
        date: data.date,
        maxParticipants: data.maxParticipants,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      }),
    });

    return handleResponse<Event>(response);
  },

  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    
    if (filters?.location) {
      params.append('location', filters.location);
    }
    
    if (filters?.searchQuery) {
      params.append('search', filters.searchQuery);
    }

    const url = `${API_BASE_URL}/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);

    return handleResponse<Event[]>(response);
  },

  async getEventById(id: string): Promise<Event | null> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    
    if (response.status === 404) {
      return null;
    }

    return handleResponse<Event>(response);
  },

  async joinEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/join`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    return handleResponse<Event>(response);
  },

  async leaveEvent(id: string): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}/leave`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });

    return handleResponse<Event>(response);
  },

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse<Event>(response);
  },

  async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
  },

  async getNearbyEvents(latitude: number, longitude: number, radius: number): Promise<{
    location: { latitude: number; longitude: number };
    radius: number;
    count: number;
    events: Array<Event & { distance: number }>;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/events/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`,
      {
        headers: getAuthHeaders(),
      }
    );

    return handleResponse(response);
  },
};
