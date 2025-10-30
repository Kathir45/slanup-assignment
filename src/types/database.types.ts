// Event type matching the REST API response
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  currentParticipants: number;
  latitude?: number | null;
  longitude?: number | null;
  creatorId: string | null;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

// Type for creating a new event
export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  date: string;
  maxParticipants: number;
  latitude?: number | null;
  longitude?: number | null;
}
