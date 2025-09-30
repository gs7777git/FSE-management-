
import React from 'react';
import type { Visit } from '../types';
import { formatTimestamp, calculateDuration } from '../utils/time';

interface CompletedVisitCardProps {
  visit: Visit;
}

const LocationLink: React.FC<{ location: Visit['startLocation'] | Visit['endLocation'], label: string }> = ({ location, label }) => {
    if (!location) {
        return <span className="text-slate-400">{label}: Not captured</span>;
    }
    const { latitude, longitude } = location;
    return (
        <a 
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
        >
            {label} Location
        </a>
    );
}

const CompletedVisitCard: React.FC<CompletedVisitCardProps> = ({ visit }) => {
  const duration = visit.endTime ? calculateDuration(visit.startTime, visit.endTime) : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-md p-5 transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-md font-bold text-slate-800">{visit.clientName}</h4>
        <span className="text-sm font-semibold text-slate-600 bg-slate-200 px-2 py-1 rounded-full">{duration}</span>
      </div>
      <p className="text-sm text-slate-500 mb-4">{visit.purpose}</p>

      {visit.notes && (
        <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200">
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Notes</h5>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{visit.notes}</p>
        </div>
      )}

      <div className="border-t border-slate-200 pt-3">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Start: {formatTimestamp(visit.startTime)}</span>
          <span>End: {visit.endTime ? formatTimestamp(visit.endTime) : 'N/A'}</span>
        </div>
        <div className="flex justify-between mt-2">
            <LocationLink location={visit.startLocation} label="Start" />
            <LocationLink location={visit.endLocation} label="End" />
        </div>
      </div>
    </div>
  );
};

export default CompletedVisitCard;
