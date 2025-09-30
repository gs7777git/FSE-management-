
import { useState, useCallback } from 'react';
import type { GeoLocation } from '../types';

export const useLocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = useCallback((): Promise<GeoLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = "Geolocation is not supported by your browser.";
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          setLoading(false);
          resolve(newLocation);
        },
        (err) => {
          let errorMsg = "An unknown error occurred.";
          if (err.code === 1) {
            errorMsg = "Please allow location access to use this feature.";
          } else if (err.code === 2) {
            errorMsg = "Location information is unavailable.";
          } else if (err.code === 3) {
            errorMsg = "Location request timed out.";
          }
          setError(errorMsg);
          setLoading(false);
          reject(new Error(errorMsg));
        }
      );
    });
  }, []);

  return { location, loading, error, getLocation };
};
