
import React, { useState, useMemo } from 'react';

// Mock Data from prompt
const MOCK_EMPLOYEES = [
  { id: '1', name: 'Apurva Kansara', email: 'apurva@sapsol.com', role: 'Employee' },
  { id: '2', name: 'Bhargav Desai', email: 'bhargav.desai@sapsol.com', role: 'Recruiter' },
  { id: '3', name: 'Jeethu Jose', email: 'jeethu@sapsol.com', role: 'Manager' },
  { id: '4', name: 'Neelam Tiwari', email: 'neelam@sapsol.com', role: 'Recruiter' },
  { id: '5', name: 'Simran Suri', email: 'simran@sapsol.com', role: 'Employee' },
  { id: '6', name: 'TEST EMP', email: 'sirot80523@bauscn.com', role: 'Employee' },
];

const ROLES_OPTIONS = ['Admin', 'Recruiter', 'Manager', 'Employee', 'Intern', 'Super Admin'];

const RoleManagement: React.FC = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

  // Filter logic
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Pagination logic
  const totalEntries = filteredEmployees.length;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEmployees.slice(indexOfFirstEntry, indexOfLastEntry);

  const handleRoleChange = (id: string, newRole: string) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, role: newRole } : e));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Roles Management</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Assign Role to active employees</p>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <span className="mr-2">Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="ml-2">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Search:</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Employee Email Id</th>
                <th className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">Assign/Edit Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentEntries.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {emp.name} ({emp.email})
                  </td>
                  <td className="px-4 py-3">
                    <select 
                      value={emp.role}
                      onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white w-full max-w-xs cursor-pointer"
                    >
                      {ROLES_OPTIONS.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {currentEntries.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-400 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div>
            Showing {filteredEmployees.length > 0 ? indexOfFirstEntry + 1 : 0} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white border border-blue-600 rounded font-bold">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => (indexOfLastEntry < totalEntries ? prev + 1 : prev))}
              disabled={indexOfLastEntry >= totalEntries}
              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoleManagement;
