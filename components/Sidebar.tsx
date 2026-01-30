
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { UserRole } from '../types';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isRecruiter = user?.role === UserRole.RECRUITER;
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  return (
    <>
      <aside className="hidden md:block w-56 shrink-0 space-y-2">
        {/* Card 1: Profile Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="h-14 w-full relative">
            <img 
              src={user?.banner || 'https://picsum.photos/seed/defaultbanner/800/200'} 
              className="w-full h-full object-cover" 
              alt="Banner" 
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
              <img 
                src={user?.avatar} 
                className="w-14 h-14 rounded-full border-2 border-white dark:border-gray-900 object-cover shadow-sm bg-white dark:bg-gray-800" 
                alt="Avatar" 
              />
            </div>
          </div>
          <div className="pt-8 pb-4 px-3 text-center border-b border-gray-100 dark:border-gray-800">
            <Link to="/profile" className="font-bold text-sm text-gray-900 dark:text-white hover:underline block truncate">
              {user?.name}
            </Link>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight px-1">
              {user?.headline}
            </p>
          </div>
          
          <div>
            <Link to="/profile" className="p-3 text-[11px] flex items-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <i className="fa-solid fa-bookmark text-gray-400 mr-2"></i>
              {isRecruiter ? 'Saved Candidates' : 'My Items'}
            </Link>
          </div>
        </div>

        {/* Card 2: Analytics/Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm py-1 transition-colors">
          <button 
            onClick={() => setShowAnalytics(true)}
            className="w-full px-3 flex justify-between items-center text-[11px] group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 py-3 transition-colors"
          >
            <span className="text-gray-500 dark:text-gray-400 font-bold text-left">
              {isRecruiter ? 'Active job posts' : 'Who viewed your profile'}
            </span>
            <span className="text-blue-600 font-bold">{isRecruiter ? '12' : '1,240'}</span>
          </button>
          <button 
            onClick={() => setShowAnalytics(true)}
            className="w-full px-3 flex justify-between items-center text-[11px] group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 py-3 transition-colors border-t border-gray-100 dark:border-gray-800"
          >
            <span className="text-gray-500 dark:text-gray-400 font-bold text-left">
              {isRecruiter ? 'New applicants' : 'Impressions of your post'}
            </span>
            <span className="text-blue-600 font-bold">{isRecruiter ? '48' : '3,892'}</span>
          </button>
        </div>

        {/* Card 3: Community & Recent Information Hub (Sticky) */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm sticky top-20 overflow-hidden transition-colors">
          <div className="p-3">
            <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider opacity-60">Recent</p>
            <ul className="space-y-1">
              <li onClick={() => setShowCommunity(true)} className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer py-1.5 px-2 rounded transition-colors group">
                <i className="fa-solid fa-users text-gray-400 group-hover:text-blue-600 mr-2 w-4 text-center"></i>
                <span className="truncate">React Developers Hub</span>
              </li>
              <li onClick={() => setShowCommunity(true)} className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer py-1.5 px-2 rounded transition-colors group">
                <i className="fa-solid fa-hashtag text-gray-400 group-hover:text-blue-600 mr-2 w-4 text-center"></i>
                <span className="truncate">javascript</span>
              </li>
              <li onClick={() => setShowCommunity(true)} className="flex items-center text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer py-1.5 px-2 rounded transition-colors group">
                <i className="fa-solid fa-calendar-day text-gray-400 group-hover:text-blue-600 mr-2 w-4 text-center"></i>
                <span className="truncate">Global AI Summit 2024</span>
              </li>
            </ul>

            <div className="mt-6 space-y-4 px-2">
              <button onClick={() => setShowCommunity(true)} className="w-full text-left text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Groups</button>
              <div className="flex justify-between items-center group cursor-pointer" onClick={() => setShowCommunity(true)}>
                <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Events</p>
                <i className="fa-solid fa-plus text-[10px] text-gray-400 group-hover:text-blue-600"></i>
              </div>
              <button onClick={() => setShowCommunity(true)} className="w-full text-left text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Followed Hashtags</button>
            </div>
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-800 text-center">
            <button 
              onClick={() => setShowCommunity(true)}
              className="text-[11px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 w-full py-3 transition-colors"
            >
              Discover more
            </button>
          </div>
        </div>
      </aside>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white">Profile Analytics</h2>
              <button onClick={() => setShowAnalytics(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="text-3xl font-black text-blue-600">1,240</div>
                  <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Profile views</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-500"><i className="fa-solid fa-arrow-trend-up mr-1"></i> 14%</div>
                  <div className="text-[10px] text-gray-400">Past 7 days</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Recent Visitors</p>
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <img src={`https://picsum.photos/seed/${i + 10}/50`} className="w-10 h-10 rounded-full" alt="" />
                    <div className="flex-1">
                      <div className="text-xs font-bold dark:text-white">Professional User {i}</div>
                      <div className="text-[10px] text-gray-500">Recruiter at InnovateX</div>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 px-3 py-1 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all">Connect</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Modal */}
      {showCommunity && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-gray-900 dark:text-white">Community Explorer</h2>
              <button onClick={() => setShowCommunity(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all group">
                  <i className="fa-solid fa-users text-2xl text-blue-500 mb-2 group-hover:scale-110 transition-transform"></i>
                  <div className="font-bold text-sm dark:text-white">Groups</div>
                  <p className="text-[10px] text-gray-500">Discover professional communities</p>
                </div>
                <div className="p-4 border dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all group">
                  <i className="fa-solid fa-calendar-check text-2xl text-green-500 mb-2 group-hover:scale-110 transition-transform"></i>
                  <div className="font-bold text-sm dark:text-white">Events</div>
                  <p className="text-[10px] text-gray-500">Attend workshops and seminars</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-bold mb-3 dark:text-white">Trending Hashtags</h3>
                <div className="flex flex-wrap gap-2">
                  {['#javascript', '#webdev', '#hiring', '#reactjs', '#futureofwork'].map(tag => (
                    <span key={tag} className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full cursor-pointer hover:underline">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
