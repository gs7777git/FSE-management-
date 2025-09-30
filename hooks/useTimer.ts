
import { useState, useEffect } from 'react';

export const useTimer = (startTime: string) => {
  const [duration, setDuration] = useState<string>('00:00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date().getTime() - new Date(startTime).getTime();
      if (diff < 0) return;

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      const h = String(hours).padStart(2, '0');
      const m = String(minutes % 60).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');

      setDuration(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return duration;
};
