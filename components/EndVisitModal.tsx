import React, { useState } from 'react';
import Spinner from './Spinner';

interface EndVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnd: (notes: string) => void;
  isEnding: boolean;
}

const EndVisitModal: React.FC<EndVisitModalProps> = ({ isOpen, onClose, onEnd, isEnding }) => {
  const [notes, setNotes] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnd(notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-4">End Visit & Add Notes</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Visit Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Add any relevant notes from the visit..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isEnding}
              className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEnding}
              className="flex items-center justify-center w-48 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
            >
              {isEnding ? <Spinner /> : 'End & Save Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EndVisitModal;
