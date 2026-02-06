
import React, { useState } from 'react';

interface Batch {
  id: string;
  name: string;
  dateRange: string;
  candidatesCount: number;
  coordinator: string;
  statusInfo: string; // e.g. "Active - Created by..."
  status: 'Active' | 'Closed';
}

const MOCK_BATCHES_DATA: Batch[] = [
  {
    id: '1',
    name: 'PHP-111420244',
    dateRange: 'From 14 Nov,2024 to 31 May,2025',
    candidatesCount: 2,
    coordinator: 'bhargav.desai@sapsol.com',
    statusInfo: 'Active - Created by bhargav.desai@sapsol.com',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Python-103120230',
    dateRange: 'From 31 Oct,2023 to 01 Sep,2024',
    candidatesCount: 1,
    coordinator: 'NA',
    statusInfo: 'Active - Created by bhargav.desai@sapsol.com',
    status: 'Active'
  },
  {
    id: '3',
    name: 'Machine Learning-090720235',
    dateRange: 'From 07 Sep,2023 to 06 Apr,2024',
    candidatesCount: 1,
    coordinator: 'NA',
    statusInfo: 'Active - Created by bhargav.desai@sapsol.com',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Testing-081020232',
    dateRange: 'From 10 Aug,2023 to 10 Feb,2024',
    candidatesCount: 0,
    coordinator: 'NA',
    statusInfo: 'Closed - Closed by',
    status: 'Closed'
  },
  {
    id: '5',
    name: 'SAP-061920232',
    dateRange: 'From 19 Jun,2023 to 20 Dec,2023',
    candidatesCount: 1,
    coordinator: 'NA',
    statusInfo: 'Closed - Closed by bhargav.desai@sapsol.com',
    status: 'Closed'
  },
  {
    id: '6',
    name: 'Python-030220236',
    dateRange: 'From 02 Mar,2023 to 02 Sep,2023',
    candidatesCount: 0,
    coordinator: 'NA',
    statusInfo: 'Active - Created by bhargav.desai@sapsol.com',
    status: 'Active'
  },
  {
    id: '7',
    name: 'Python-012020236',
    dateRange: 'From 20 Jan,2023 to 23 Jul,2023',
    candidatesCount: 0,
    coordinator: 'NA',
    statusInfo: 'Closed - Closed by bhargav.desai@sapsol.com',
    status: 'Closed'
  },
  {
    id: '8',
    name: 'Python-122120224',
    dateRange: 'From 21 Dec,2022 to 23 Jun,2023',
    candidatesCount: 3,
    coordinator: 'NA',
    statusInfo: 'Active - Created by bhargav.desai@sapsol.com',
    status: 'Active'
  },
  {
    id: '9',
    name: 'PHP-100320221',
    dateRange: 'From 03 Oct,2022 to 05 Apr,2023',
    candidatesCount: 0,
    coordinator: 'NA',
    statusInfo: 'Active - Created by arnab.ghorai@sapsol.com',
    status: 'Active'
  },
  {
    id: '10',
    name: 'SAP-030820225',
    dateRange: 'From 08 Mar,2022 to 08 Sep,2022',
    candidatesCount: 2,
    coordinator: 'NA',
    statusInfo: 'Active - Created by seetha@sapsol.com',
    status: 'Active'
  }
];

const BatchManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(MOCK_BATCHES_DATA.length / itemsPerPage);
  const currentBatches = MOCK_BATCHES_DATA.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Batch Management</h1>
        </div>
        {/* Placeholder for potential search/filter if needed later */}
      </div>

      {/* Batches List Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex-1">
        
        {/* Table Header - Hidden on mobile, visible on desktop for structure */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Batch Name</div>
          <div className="col-span-8">Status / Details</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {currentBatches.map((batch) => (
            <div key={batch.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Left Column: Name & Dates */}
                <div className="col-span-1 md:col-span-4">
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {batch.name}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {batch.dateRange}
                  </div>
                </div>

                {/* Right Column: Details & Status */}
                <div className="col-span-1 md:col-span-8 flex flex-col justify-center space-y-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {batch.candidatesCount} Candidates
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Project Coordinator: <span className="font-medium text-gray-700 dark:text-gray-300">{batch.coordinator}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <span className={`text-sm font-bold ${
                        batch.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {batch.statusInfo}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1">
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
        </button>
        
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
              currentPage === i + 1
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <i className="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-2 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">Privacy Policy | Terms and Conditions</p>
        <p>© 2026 SAPSOL Technologies Inc. All rights reserved. Designed and Developed by SAPSOL Technologies Inc.</p>
      </div>
    </div>
  );
};

export default BatchManagement;
