
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm, users, jobs, isDarkMode, toggleDarkMode } = useApp();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAppsOpen, setIsAppsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const isRecruiter = user?.role === UserRole.RECRUITER;

  // Global search results
  const filteredUsers = searchTerm 
    ? users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.headline.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4)
    : [];

  const filteredJobs = searchTerm
    ? jobs.filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.company.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 4)
    : [];

  const showResults = isSearchFocused && searchTerm.length > 0 && (filteredUsers.length > 0 || filteredJobs.length > 0);

  // Close search results on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- RECRUITER SIDEBAR UI ---
  if (isRecruiter) {
    return (
      <nav className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-colors">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <Link to="/" className="text-blue-600 font-bold text-2xl flex items-center">
            <i className="fa-solid fa-briefcase mr-3"></i>
            <span>HireRig</span>
          </Link>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <Link to="/" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-gauge-high w-5 text-center"></i>
            <span>Dashboard</span>
          </Link>

          {/* Applications Dropdown */}
          <div className="pt-1">
            <button 
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${location.pathname.includes('/applications') || isAppsOpen ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className="flex items-center space-x-3">
                <i className="fa-solid fa-file-lines w-5 text-center"></i>
                <span>Applications</span>
              </div>
              <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isAppsOpen ? 'rotate-180' : ''}`}></i>
            </button>
            
            {isAppsOpen && (
              <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1">
                <Link to="/consultant" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/consultant') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  a. Meet the consultant
                </Link>
                <Link to="/submitted" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/submitted') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  b. Submitted
                </Link>
                <Link to="/applications" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/applications') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  c. Applications
                </Link>
                <Link to="/enrollment" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/enrollment') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  d. New Enrollment
                </Link>
                <Link to="/registration" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/registration') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  e. Registration
                </Link>
                <Link to="/project" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/project') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  f. Project
                </Link>
                <Link to="/placements" className={`block px-3 py-2 rounded-md text-xs font-medium transition-colors ${isActive('/placements') ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  h. Placements
                </Link>
              </div>
            )}
          </div>

          <Link to="/candidates" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/candidates') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-users w-5 text-center"></i>
            <span>Candidates</span>
          </Link>
          <Link to="/subscribers" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/subscribers') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-rss w-5 text-center"></i>
            <span>Subscribers</span>
          </Link>
          <Link to="/post-job" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/post-job') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-bullhorn w-5 text-center"></i>
            <span>Post a Job</span>
          </Link>
          <Link to="/generate-project" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/generate-project') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-wand-magic-sparkles w-5 text-center"></i>
            <span>Generate Project</span>
          </Link>
          <Link to="/roles" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/roles') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-sitemap w-5 text-center"></i>
            <span>Role Management</span>
          </Link>
          <Link to="/jobs" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/jobs') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-briefcase w-5 text-center"></i>
            <span>Jobs</span>
          </Link>
          <Link to="/batches" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/batches') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-layer-group w-5 text-center"></i>
            <span>Batch Management</span>
          </Link>
          <Link to="/promotions" className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/promotions') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            <i className="fa-solid fa-award w-5 text-center"></i>
            <span>Promotions</span>
          </Link>
        </div>

        {/* Footer Profile Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 shrink-0 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-3 mb-4">
            <img src={user?.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Recruiter</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={toggleDarkMode}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} mr-1`}></i>
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button 
              onClick={logout}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket mr-1"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // --- CANDIDATE NAVBAR UI (ORIGINAL) ---
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-14 shadow-sm">
      <div className="max-w-full mx-auto h-full px-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center space-x-4 shrink-0">
          <Link to="/" className="text-blue-600 font-bold text-2xl flex items-center">
            <i className="fa-solid fa-briefcase mr-2"></i>
            <span className="hidden sm:inline">HireRig</span>
          </Link>
        </div>

        {/* Search Bar - Only for Candidates */}
        <div className="relative max-w-xs w-full hidden md:block" ref={searchRef}>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search jobs, people..." 
            className="bg-gray-100 dark:bg-gray-800 border-none rounded-md py-1.5 pl-10 pr-4 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 dark:text-white transition-all outline-none"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-sm"></i>

          {/* Live Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-lg shadow-xl mt-1 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {filteredUsers.length > 0 && (
                <div className="py-2">
                  <h3 className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">People</h3>
                  {filteredUsers.map(u => (
                    <div 
                      key={u.id} 
                      onClick={() => { 
                        setIsSearchFocused(false); 
                        setSearchTerm(''); 
                        navigate(`/profile/${u.id}`); 
                      }}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors"
                    >
                      <img src={u.avatar} className="w-8 h-8 rounded-full mr-3 object-cover border border-gray-100 dark:border-gray-600" alt="" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{u.headline}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredJobs.length > 0 && (
                <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                  <h3 className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Jobs</h3>
                  {filteredJobs.map(j => (
                    <div 
                      key={j.id} 
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSearchTerm(j.title);
                        navigate('/jobs');
                      }}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center mr-3 shrink-0 border border-blue-100 dark:border-blue-800">
                        <i className="fa-solid fa-briefcase text-sm"></i>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{j.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{j.company} • {j.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links (Candidate) */}
        <div className="flex-1 flex items-center justify-center overflow-x-auto no-scrollbar mask-gradient">
          <div className="flex items-center space-x-6">
            <Link to="/" className={`flex flex-col items-center text-xs transition-colors ${isActive('/') ? 'text-black dark:text-white font-bold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
              <div className={`mb-0.5 relative h-6 flex items-center ${isActive('/') ? 'after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-black dark:after:bg-white' : ''}`}>
                <i className="fa-solid fa-house text-xl"></i>
              </div>
              <span className="mt-1 hidden sm:inline">Home</span>
            </Link>
            <Link to="/jobs" className={`flex flex-col items-center text-xs transition-colors ${isActive('/jobs') ? 'text-black dark:text-white font-bold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
              <div className={`mb-0.5 relative h-6 flex items-center ${isActive('/jobs') ? 'after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-black dark:after:bg-white' : ''}`}>
                <i className="fa-solid fa-briefcase text-xl"></i>
              </div>
              <span className="mt-1 hidden sm:inline">Jobs</span>
            </Link>
            <Link to="/messaging" className={`flex flex-col items-center text-xs transition-colors ${isActive('/messaging') ? 'text-black dark:text-white font-bold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
              <div className={`mb-0.5 relative h-6 flex items-center ${isActive('/messaging') ? 'after:content-[""] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-0.5 after:bg-black dark:after:bg-white' : ''}`}>
                <i className="fa-solid fa-comment-dots text-xl"></i>
              </div>
              <span className="mt-1 hidden sm:inline">Messaging</span>
            </Link>
          </div>
        </div>

        {/* Right Section: Theme & Profile */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleDarkMode}
            className="flex flex-col items-center text-xs text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <div className="mb-0.5 h-6 flex items-center">
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
            </div>
            <span className="mt-1 hidden sm:inline">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          
          <div className="relative group cursor-pointer flex flex-col items-center text-xs text-gray-500">
            <img src={user?.avatar} alt="Me" className="w-8 h-8 rounded-full object-cover mb-0.5 border border-gray-200 dark:border-gray-700 shadow-sm" />
            <span className="flex items-center hover:text-black dark:hover:text-white transition-colors">Me <i className="fa-solid fa-caret-down ml-1"></i></span>
            
            <div className="absolute top-12 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-[60]">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 flex items-center">
                <img src={user?.avatar} alt="Me" className="w-12 h-12 rounded-full mr-3 border border-gray-100 dark:border-gray-600 shadow-sm" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.headline}</div>
                </div>
              </div>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm dark:text-gray-200 transition-colors">View Profile</Link>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-2">
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 font-medium transition-colors">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
