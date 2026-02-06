
import React, { useState } from 'react';

const UPCOMING_BATCHES = [
  { id: 1, name: 'React Mastery - Batch A', date: 'Oct 30, 2023', seats: 25, filled: 18, type: 'Online' },
  { id: 2, name: 'Data Science - Cohort 4', date: 'Nov 05, 2023', seats: 40, filled: 12, type: 'Hybrid' },
  { id: 3, name: 'UX Design Essentials', date: 'Nov 12, 2023', seats: 20, filled: 20, type: 'Online' },
];

const Registration: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const openRegister = (batch: any) => {
    setSelectedBatch(batch);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registration</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage batch registrations and allocate students.</p>
        </div>
        <button className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-all shadow-lg">
          <i className="fa-solid fa-plus mr-2"></i> Create New Batch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {UPCOMING_BATCHES.map(batch => (
          <div key={batch.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                batch.seats === batch.filled 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {batch.seats === batch.filled ? 'Full' : 'Open'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{batch.name}</h3>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i className="fa-regular fa-calendar w-6"></i>
                <span>Starts: {batch.date}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <i className="fa-solid fa-video w-6"></i>
                <span>Format: {batch.type}</span>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>Capacity</span>
                <span>{batch.filled} / {batch.seats}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${batch.seats === batch.filled ? 'bg-red-500' : 'bg-blue-600'}`} 
                  style={{ width: `${(batch.filled / batch.seats) * 100}%` }}
                ></div>
              </div>
              
              <button 
                onClick={() => openRegister(batch)}
                disabled={batch.seats === batch.filled}
                className="w-full py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-blue-600 hover:text-white hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {batch.seats === batch.filled ? 'Waitlist Only' : 'Register Candidate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {showModal && selectedBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold dark:text-white">Register for {selectedBatch.name}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Candidate</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white">
                  <option>Search for candidate...</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                </select>
              </div>
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
                <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium">
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                  This will deduct 1 seat from the batch capacity immediately.
                </p>
              </div>
              <button 
                onClick={() => { alert('Registered!'); setShowModal(false); }}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
