
import React from 'react';

const RECENT_PLACEMENTS = [
  { id: 1, name: 'Sarah Connor', company: 'Cyberdyne Systems', role: 'Security Engineer', salary: '$140k', date: '2 days ago', logo: 'https://logo.clearbit.com/cyberdyne.jp' },
  { id: 2, name: 'James Rodriguez', company: 'Google', role: 'Frontend Dev', salary: '$180k', date: '1 week ago', logo: 'https://logo.clearbit.com/google.com' },
  { id: 3, name: 'Emily Davis', company: 'Netflix', role: 'DevOps Lead', salary: '$210k', date: '2 weeks ago', logo: 'https://logo.clearbit.com/netflix.com' },
];

const Placements: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Placement Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track career success and hiring milestones.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 font-medium mb-1">Total Placements</p>
            <h2 className="text-4xl font-black">1,248</h2>
            <div className="mt-4 flex items-center text-sm bg-blue-500/30 w-fit px-2 py-1 rounded-lg backdrop-blur-sm">
              <i className="fa-solid fa-arrow-trend-up mr-2"></i> +12% this month
            </div>
          </div>
          <i className="fa-solid fa-trophy absolute -bottom-4 -right-4 text-9xl text-white opacity-10 rotate-12"></i>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs mb-2">Avg. Salary Hike</p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-4xl font-black text-green-600 dark:text-green-400">45%</h2>
            <span className="text-gray-400 font-medium">avg</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-4">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-xs mb-2">Partner Companies</p>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white">320+</h2>
          <div className="flex -space-x-2 mt-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                C{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-gray-500 font-bold">+</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Placements List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg dark:text-white">Recent Success Stories</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-bold">View All</button>
          </div>
          <div className="space-y-6">
            {RECENT_PLACEMENTS.map(placement => (
              <div key={placement.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100 p-2">
                  {/* Fallback icon if logo fails, simplified for mock */}
                  <i className="fa-solid fa-building text-gray-400 text-xl"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white">{placement.name}</h4>
                  <p className="text-sm text-gray-500">{placement.role} at <span className="font-semibold text-gray-700 dark:text-gray-300">{placement.company}</span></p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 dark:text-green-400">{placement.salary}</div>
                  <div className="text-xs text-gray-400">{placement.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts / Visuals Area */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-lg dark:text-white mb-6">Placement Distribution</h3>
          
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simple CSS-only Donut Chart representation */}
            <div className="w-48 h-48 rounded-full border-[16px] border-blue-500 border-r-indigo-500 border-b-purple-500 border-l-green-500 transform rotate-45 flex items-center justify-center">
               <div className="text-center transform -rotate-45">
                 <span className="block text-3xl font-black dark:text-white">92%</span>
                 <span className="text-xs text-gray-500 font-bold uppercase">Success Rate</span>
               </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> Tech Giants</div>
              <span className="font-bold dark:text-white">40%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span> Startups</div>
              <span className="font-bold dark:text-white">25%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span> Fintech</div>
              <span className="font-bold dark:text-white">20%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Others</div>
              <span className="font-bold dark:text-white">15%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Placements;
