import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import NewVisitModal from './components/NewVisitModal';
import CurrentVisitCard from './components/CurrentVisitCard';
import CompletedVisitCard from './components/CompletedVisitCard';
import EndVisitModal from './components/EndVisitModal';
import type { Visit } from './types';
import { useLocation } from './hooks/useLocation';

const App: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>(() => {
    try {
      const savedVisits = localStorage.getItem('field-visits');
      return savedVisits ? JSON.parse(savedVisits) : [];
    } catch (error) {
      console.error("Could not parse visits from localStorage", error);
      return [];
    }
  });

  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);
  const [isEndVisitModalOpen, setIsEndVisitModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getLocation, error: locationError } = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem('field-visits', JSON.stringify(visits));
    } catch (error) {
      console.error("Could not save visits to localStorage", error);
    }
  }, [visits]);

  useEffect(() => {
      if (locationError) {
          setErrorMessage(locationError);
          setIsProcessing(false);
      }
  }, [locationError]);

  const currentVisit = useMemo(() => visits.find(v => v.endTime === null), [visits]);
  const completedVisits = useMemo(() => visits.filter(v => v.endTime !== null).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()), [visits]);

  const handleStartVisit = async (clientName: string, purpose: string) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const startLocation = await getLocation();
      const newVisit: Visit = {
        id: new Date().toISOString(),
        clientName,
        purpose,
        startTime: new Date().toISOString(),
        endTime: null,
        startLocation,
        endLocation: null,
      };
      setVisits(prev => [...prev, newVisit]);
      setIsNewVisitModalOpen(false);
    } catch (error) {
      // Error message is set by the useLocation hook's effect
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndVisit = async (notes: string) => {
    if (!currentVisit) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const endLocation = await getLocation();
      setVisits(prev =>
        prev.map(v =>
          v.id === currentVisit.id
            ? { ...v, endTime: new Date().toISOString(), endLocation, notes }
            : v
        )
      );
      setIsEndVisitModalOpen(false);
    } catch (error) {
       // Error message is set by the useLocation hook's effect
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{errorMessage}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMessage(null)}>
                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}
        
        {currentVisit ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">Current Visit</h2>
            <CurrentVisitCard
              visit={currentVisit}
              onEnd={() => setIsEndVisitModalOpen(true)}
              isLoading={isProcessing}
            />
          </div>
        ) : (
          <div className="text-center mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-slate-600 mb-3">No active visit.</h2>
            <button
              onClick={() => { setIsNewVisitModalOpen(true); setErrorMessage(null); }}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start New Visit
            </button>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Completed Visits</h2>
          {completedVisits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedVisits.map(visit => (
                <CompletedVisitCard key={visit.id} visit={visit} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <p className="text-slate-500">No completed visits yet.</p>
            </div>
          )}
        </div>

        <NewVisitModal
          isOpen={isNewVisitModalOpen}
          onClose={() => setIsNewVisitModalOpen(false)}
          onStart={handleStartVisit}
          isStarting={isProcessing}
        />

        <EndVisitModal
          isOpen={isEndVisitModalOpen}
          onClose={() => setIsEndVisitModalOpen(false)}
          onEnd={handleEndVisit}
          isEnding={isProcessing}
        />
      </main>
    </div>
  );
};

export default App;
