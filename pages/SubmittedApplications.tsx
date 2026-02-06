
import React, { useState } from 'react';

// Mock Data
const MOCK_SUBMISSIONS = [
  { id: 1, name: 'Sarah Connor', role: 'Senior React Developer', date: '2023-10-24', status: 'Pending', email: 'sarah@example.com', resume: 'sarah_resume.pdf' },
  { id: 2, name: 'Michael Chen', role: 'UX/UI Designer', date: '2023-10-23', status: 'Reviewed', email: 'michael@example.com', resume: 'michael_portfolio.pdf' },
  { id: 3, name: 'Emily Davis', role: 'DevOps Engineer', date: '2023-10-22', status: 'Interviewing', email: 'emily@example.com', resume: 'emily_cv.pdf' },
  { id: 4, name: 'David Kim', role: 'Product Manager', date: '2023-10-21', status: 'Rejected', email: 'david@example.com', resume: 'david_pm.pdf' },
  { id: 5, name: 'Lisa Wang', role: 'Data Scientist', date: '2023-10-20', status: 'Pending', email: 'lisa@example.com', resume: 'lisa_data.pdf' },
  { id: 6, name: 'James Smith', role: 'Senior React Developer', date: '2023-10-19', status: 'Reviewed', email: 'james@example.com', resume: 'james_dev.pdf' },
];

const SubmittedApplications: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const filteredApps = MOCK_SUBMISSIONS.filter(app => {
    const matchesFilter = filter === 'All' || app.status === filter;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || app.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submitted Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Review and manage incoming job applications.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 rounded-lg text-gray-500 hover:text-blue-600">
            <i className="fa-solid fa-filter"></i>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {['All', 'Pending', 'Interviewing', 'Rejected'].map((status) => (
          <button 
            key={status}
            onClick={() => setFilter(status)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filter === status 
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 ring-1 ring-blue-500' 
              : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <div className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">{status}</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white">
              {status === 'All' ? MOCK_SUBMISSIONS.length : MOCK_SUBMISSIONS.filter(a => a.status === status).length}
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Applied Role</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{app.name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{app.role}</td>
                  <td className="px-6 py-4 text-gray-500">{app.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      app.status === 'Reviewed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      app.status === 'Interviewing' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedApp(app)}
                      className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 dark:border-blue-900 px-3 py-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApps.length === 0 && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No applications found matching your criteria.
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Application Details</h3>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-2xl font-bold text-gray-500">
                  {selectedApp.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold dark:text-white">{selectedApp.name}</h4>
                  <p className="text-sm text-gray-500">{selectedApp.email}</p>
                  <p className="text-sm text-blue-600 mt-1">Applied for: {selectedApp.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase">Status</span>
                  <span className="font-medium dark:text-white">{selectedApp.status}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase">Applied On</span>
                  <span className="font-medium dark:text-white">{selectedApp.date}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase">Resume</span>
                  <button className="text-blue-600 hover:underline text-sm flex items-center">
                    <i className="fa-solid fa-file-pdf mr-1"></i> {selectedApp.resume}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors">
                  Advance to Interview
                </button>
                <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 font-bold py-2.5 rounded-lg transition-colors">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedApplications;
