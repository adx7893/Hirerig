
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { analyzeJobMatch } from '../services/geminiService';
import { Job } from '../types';

const Jobs: React.FC = () => {
  const { user } = useAuth();
  const { jobs, applyForJob, searchTerm } = useApp();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  // Live filter jobs list based on searchTerm
  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    const lower = searchTerm.toLowerCase();
    return jobs.filter(j => 
      j.title.toLowerCase().includes(lower) || 
      j.company.toLowerCase().includes(lower) ||
      j.description.toLowerCase().includes(lower) ||
      j.location.toLowerCase().includes(lower)
    );
  }, [jobs, searchTerm]);

  const handleSelectJob = async (job: Job) => {
    setSelectedJob(job);
    setAiAnalysis(null);
    if (user) {
      setIsAnalyzing(true);
      const result = await analyzeJobMatch(user, job);
      setAiAnalysis(result);
      setIsAnalyzing(false);
    }
  };

  const handleApply = (jobId: string) => {
    if (user) {
      applyForJob(jobId, user.id);
      alert("Successfully applied! Recruiter notified.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 h-[calc(100vh-64px)]">
      {/* Left List */}
      <div className="w-full md:w-96 overflow-y-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Job picks for you'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {searchTerm ? `${filteredJobs.length} matches found` : 'Based on your profile and search history'}
          </p>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800 flex-1 overflow-y-auto">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <div 
              key={job.id} 
              onClick={() => handleSelectJob(job)}
              className={`p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${selectedJob?.id === job.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600' : ''}`}
            >
              <div className="flex space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-blue-600 shrink-0 border border-gray-200 dark:border-gray-700">
                  <i className="fa-solid fa-building text-2xl"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate">{job.title}</h3>
                  <p className="text-sm text-gray-900 dark:text-gray-200">{job.company}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.location} ({job.type})</p>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-[10px] text-green-600 dark:text-green-500 font-bold flex items-center">
                      <i className="fa-solid fa-bolt mr-1"></i> Actively hiring
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center">
              <i className="fa-solid fa-briefcase text-gray-200 dark:text-gray-800 text-4xl mb-3"></i>
              <p className="text-sm text-gray-500 dark:text-gray-400">No jobs found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Details */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-y-auto transition-colors">
        {selectedJob ? (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{selectedJob.title}</h1>
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">{selectedJob.company}</span>
                  <span>•</span>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <i className="fa-solid fa-briefcase mr-2 text-gray-400"></i> {selectedJob.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <i className="fa-solid fa-money-bill-wave mr-2 text-gray-400"></i> {selectedJob.salary || 'Competitive'}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleApply(selectedJob.id)}
                  className={`bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition-colors ${selectedJob.applicants.includes(user?.id || '') ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedJob.applicants.includes(user?.id || '')}
                >
                  {selectedJob.applicants.includes(user?.id || '') ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>

            {/* AI Analysis Card */}
            <div className="mb-8 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-indigo-600 dark:text-indigo-400"></i>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-200">AI Match Analysis</h3>
                </div>
                {isAnalyzing && <i className="fa-solid fa-circle-notch fa-spin text-indigo-600 dark:text-indigo-400"></i>}
              </div>
              
              {aiAnalysis ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path className="text-indigo-200 dark:text-indigo-900" strokeWidth="3" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-indigo-600 dark:text-indigo-400" strokeWidth="3" strokeDasharray={`${aiAnalysis.score}, 100`} strokeLinecap="round" stroke="currentColor" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <text x="18" y="20.35" className="text-[8px] font-bold fill-indigo-900 dark:fill-indigo-100 text-center" textAnchor="middle">{aiAnalysis.score}%</text>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">Profile Match Score</p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-300">{aiAnalysis.reasoning}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-indigo-500 dark:text-indigo-400 italic">Select a job to see your AI-powered match probability based on your skills and experience.</p>
              )}
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">About the job</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedJob.description}</p>
              </section>

              <section>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-2">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300">{req}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
              <i className="fa-solid fa-briefcase text-4xl text-gray-300 dark:text-gray-700"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select a job to view details</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2">Browse the list on the left to find your next career opportunity.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
