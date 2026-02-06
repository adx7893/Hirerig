
import React, { useState } from 'react';
import { analyzeResumeWithGemini } from '../services/geminiService';

// Interfaces for the API response structure
interface RecommendedModule {
  id: number;
  title: string;
  level: string;
  duration: string;
}

interface OpenPosition {
  id: number;
  jobTitle: string;
  company: string;
  salaryRange: string;
  applyLink: string;
}

interface AnalysisResult {
  candidateAnalysis: string;
  recommendedModules: RecommendedModule[];
  openPositions: OpenPosition[];
}

const CareerAgent: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (basic check)
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        alert("Please upload a PDF, DOCX, or TXT file.");
        return;
      }

      setFileName(file.name);
      setStatus('analyzing');
      setAnalysisResult(null); // Clear previous results

      try {
        const result = await analyzeResumeWithGemini(file);
        
        if (result) {
          setAnalysisResult(result);
          setStatus('complete');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Failed to analyze resume", error);
        setStatus('error');
      }
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setFileName('');
    setAnalysisResult(null);
  };

  // Helper to open Google Search for a module
  const handleModuleClick = (topic: string) => {
    const query = encodeURIComponent(`${topic} course or tutorial`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-up min-h-[80vh]">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          AI Career Agent <span className="text-blue-600">.</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload your resume and let our AI find your perfect career path.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* STATE: IDLE */}
        {status === 'idle' && (
          <div className="bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center hover:border-blue-500 dark:hover:border-blue-500 transition-colors group cursor-pointer relative">
            <input 
              type="file" 
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Drop your resume here</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Support for PDF, DOCX (Max 5MB)
            </p>
            <button className="mt-6 bg-blue-600 text-white font-bold py-2.5 px-6 rounded-full shadow-lg group-hover:bg-blue-700 transition-colors">
              Browse Files
            </button>
          </div>
        )}

        {/* STATE: ANALYZING */}
        {status === 'analyzing' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-lg border border-gray-100 dark:border-gray-800">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <i className="fa-solid fa-wand-magic-sparkles absolute inset-0 m-auto w-fit h-fit text-2xl text-blue-600 animate-pulse"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analyzing Resume...</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Extracting skills and matching jobs for <span className="font-semibold text-gray-700 dark:text-gray-300">{fileName}</span>
            </p>
          </div>
        )}

        {/* STATE: ERROR */}
        {status === 'error' && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center shadow-lg border border-red-100 dark:border-red-900/50">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-600"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Analysis Failed</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We couldn't process your resume. Please check your internet connection or try a different file format.
            </p>
            <button 
              onClick={handleReset}
              className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-bold py-2.5 px-6 rounded-full transition-colors hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* STATE: COMPLETE */}
        {status === 'complete' && analysisResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Candidate Analysis (Chat Bubble Style) */}
            <div className="flex gap-4 items-end">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mb-2 shadow-md">
                <i className="fa-solid fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl rounded-bl-none shadow-xl max-w-2xl relative">
                <h3 className="font-bold text-lg mb-2 flex items-center">
                  <i className="fa-solid fa-chart-pie mr-2"></i> Career Analysis
                </h3>
                <div className="text-blue-50 leading-relaxed whitespace-pre-wrap">
                  {/* Parsing markdown-like bold syntax for display if AI returns it */}
                  {analysisResult.candidateAnalysis.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 2. Recommended Modules */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-graduation-cap text-green-500 mr-2"></i> Recommended Learning
                </h3>
                <div className="space-y-3">
                  {analysisResult.recommendedModules?.map((module, index) => (
                    <div 
                      key={module.id || index} 
                      onClick={() => handleModuleClick(module.title)}
                      className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/10 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all cursor-pointer"
                      title="Click to search on Google"
                    >
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                          {module.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {module.level} • {module.duration}
                        </div>
                      </div>
                      <i className="fa-brands fa-google text-gray-300 group-hover:text-green-500 transition-colors text-xs"></i>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Job Matches */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <i className="fa-solid fa-briefcase text-purple-500 mr-2"></i> Job Suggestions
                </h3>
                <div className="space-y-3">
                  {analysisResult.openPositions?.map((job, index) => (
                    <div key={job.id || index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{job.jobTitle}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{job.company}</div>
                        </div>
                        <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded">
                          {job.salaryRange}
                        </span>
                      </div>
                      <a 
                        href={job.applyLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full mt-2 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50 py-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
                      >
                        Search Job <i className="fa-solid fa-magnifying-glass ml-1"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={handleReset}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-semibold flex items-center justify-center mx-auto"
              >
                <i className="fa-solid fa-rotate-right mr-2"></i> Analyze another resume
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAgent;
