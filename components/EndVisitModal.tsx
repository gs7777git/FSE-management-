
import React, { useState } from 'react';

interface EndVisitModalProps {
  onConfirm: (notes: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EndVisitModal: React.FC<EndVisitModalProps> = ({ onConfirm, onCancel, isLoading }) => {
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-slate-800 mb-4">End Visit & Add Notes</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-1">
              Visit Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any relevant notes from the meeting..."
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400"
            >
              {isLoading ? 'Ending...' : 'Confirm & End Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EndVisitModal;
