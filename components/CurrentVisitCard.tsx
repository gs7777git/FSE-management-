
import React from 'react';
import type { Visit } from '../types';
import { useTimer } from '../hooks/useTimer';
import { formatTimestamp } from '../utils/time';
import Spinner from './Spinner';

interface CurrentVisitCardProps {
  visit: Visit;
  onEnd: () => void;
  isLoading: boolean;
}

const CurrentVisitCard: React.FC<CurrentVisitCardProps> = ({ visit, onEnd, isLoading }) => {
  const duration = useTimer(visit.startTime);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{visit.clientName}</h3>
          <p className="text-sm text-slate-500">{visit.purpose}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
            {duration}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Started at {formatTimestamp(visit.startTime)}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onEnd}
          disabled={isLoading}
          className="flex items-center justify-center w-36 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
        >
          {isLoading ? <Spinner /> : 'End Meeting'}
        </button>
      </div>
    </div>
  );
};

export default CurrentVisitCard;
