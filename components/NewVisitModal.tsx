import React, { useState } from 'react';
import Spinner from './Spinner';

interface NewVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (clientName: string, purpose: string) => void;
  isStarting: boolean;
}

const NewVisitModal: React.FC<NewVisitModalProps> = ({ isOpen, onClose, onStart, isStarting }) => {
  const [clientName, setClientName] = useState('');
  const [purpose, setPurpose] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName.trim() && purpose.trim()) {
      onStart(clientName, purpose);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Start New Visit</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="clientName" className="block text-sm font-medium text-slate-700">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
              Purpose of Visit
            </label>
            <textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isStarting}
              className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting || !clientName.trim() || !purpose.trim()}
              className="flex items-center justify-center w-36 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isStarting ? <Spinner /> : 'Start Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewVisitModal;
