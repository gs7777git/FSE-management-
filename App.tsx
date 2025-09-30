
import React, { useState, useEffect, useCallback } from 'react';
import type { Visit, GeoLocation } from './types';
import Header from './components/Header';
import CurrentVisitCard from './components/CurrentVisitCard';
import CompletedVisitCard from './components/CompletedVisitCard';
import NewVisitModal from './components/NewVisitModal';
import EndVisitModal from './components/EndVisitModal';
import { useLocation } from './hooks/useLocation';

const App: React.FC = () => {
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(() => {
    const saved = localStorage.getItem('currentVisit');
    return saved ? JSON.parse(saved) : null;
  });

  const [visits, setVisits] = useState<Visit[]>(() => {
    const saved = localStorage.getItem('visits');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const { loading: isLocationLoading, error: locationError, getLocation } = useLocation();

  useEffect(() => {
    if (currentVisit) {
      localStorage.setItem('currentVisit', JSON.stringify(currentVisit));
    } else {
      localStorage.removeItem('currentVisit');
    }
  }, [currentVisit]);

  useEffect(() => {
    localStorage.setItem('visits', JSON.stringify(visits));
  }, [visits]);

  const handleStartVisit = useCallback(async (clientName: string, purpose: string) => {
    try {
      const location = await getLocation();
      const newVisit: Visit = {
        id: crypto.randomUUID(),
        clientName,
        purpose,
        startTime: new Date().toISOString(),
        startLocation: location,
        endTime: null,
        endLocation: null,
      };
      setCurrentVisit(newVisit);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to start visit:", error);
      // Error is handled and displayed by the useLocation hook
    }
  }, [getLocation]);

  const handleEndVisit = useCallback(async (notes: string) => {
    if (!currentVisit) return;
    try {
      const location: GeoLocation = await getLocation();
      const completedVisit: Visit = {
        ...currentVisit,
        endTime: new Date().toISOString(),
        endLocation: location,
        notes: notes.trim() || undefined,
      };
      setVisits(prevVisits => [completedVisit, ...prevVisits]);
      setCurrentVisit(null);
      setIsEndModalOpen(false);
    } catch (error) {
      console.error("Failed to end visit:", error);
    }
  }, [currentVisit, getLocation]);

  return (
    <div className="min-h-screen">
      <Header />
      {isModalOpen && (
        <NewVisitModal 
          onStart={handleStartVisit} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLocationLoading}
        />
      )}
      {isEndModalOpen && currentVisit && (
        <EndVisitModal
          onConfirm={handleEndVisit}
          onCancel={() => setIsEndModalOpen(false)}
          isLoading={isLocationLoading}
        />
      )}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {locationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{locationError}</span>
          </div>
        )}
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Current Activity</h2>
          {currentVisit ? (
            <CurrentVisitCard 
              visit={currentVisit} 
              onEnd={() => setIsEndModalOpen(true)} 
              isLoading={isLocationLoading}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <p className="text-slate-600 mb-4">You do not have an active meeting.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start New Visit
              </button>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Daily Report</h2>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
             <p className="font-bold text-slate-800">Total Visits Today: <span className="text-blue-600 text-lg">{visits.length}</span></p>
          </div>
          {visits.length > 0 ? (
            <div className="space-y-4">
              {visits.map(visit => (
                <CompletedVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-slate-500">No completed visits for today.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
