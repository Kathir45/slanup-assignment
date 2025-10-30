import { useState, useEffect } from 'react';
import { getUserLocation, type Coordinates } from '../utils/geolocation';

interface GeolocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
  });

  const requestLocation = async () => {
    setState({ coordinates: null, isLoading: true, error: null });

    try {
      const coords = await getUserLocation();
      setState({ coordinates: coords, isLoading: false, error: null });
    } catch (err) {
      setState({
        coordinates: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to get location',
      });
    }
  };

  return {
    ...state,
    requestLocation,
  };
};
