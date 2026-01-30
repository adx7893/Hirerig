
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/Feed/PostCard';
import { Post, Job, UserRole } from '../types';

type PostMode = 'text' | 'photo' | 'video' | 'event' | 'article';
type DashboardView = 'main' | 'non-project' | 'project' | 'kpi';

const Home: React.FC = () => {
  const { user: authUser } = useAuth();
  const { posts, addPost, users, jobs, addJob, toggleConnect, sendMessage } = useApp();
  const navigate = useNavigate();
  
  // Candidate / Feed Logic States
  const [isPosting, setIsPosting] = useState(false);
  const [postMode, setPostMode] = useState<PostMode>('text');
  const [newPostContent, setNewPostContent] = useState('');

  // Recruiter Logic States
  const [dashboardView, setDashboardView] = useState<DashboardView>('main');
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as 'Full-time' | 'Part-time' | 'Remote' | 'Contract',
    salary: '',
    description: '',
    requirements: ''
  });

  const isRecruiter = authUser?.role === UserRole.RECRUITER;

  // Recruiter: Derived Data
  const myJobs = useMemo(() => jobs.filter(j => j.postedBy === authUser?.id), [jobs, authUser]);
  const candidateCount = useMemo(() => users.filter(u => u.role === UserRole.CANDIDATE).length, [users]);
  const jobsForReviewCount = useMemo(() => jobs.filter(j => j.applicants.length > 0).length, [jobs]); // Logic: Jobs with applicants need review

  // Actions
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser || !newPostContent.trim()) return;
    
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      authorId: authUser.id,
      authorName: authUser.name,
      authorAvatar: authUser.avatar,
      authorHeadline: authUser.headline,
      content: newPostContent,
      likes: [],
      comments: [],
      timestamp: new Date().toISOString()
    };

    addPost(newPost);
    setNewPostContent('');
    setIsPosting(false);
  };

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location,
      type: jobForm.type,
      salary: jobForm.salary,
      description: jobForm.description,
      requirements: jobForm.requirements.split(',').map(r => r.trim()),
      postedBy: authUser.id,
      applicants: [],
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Open'
    };

    addJob(newJob);
    setShowJobModal(false);
    setJobForm({
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: ''
    });
    alert('Job posted successfully! Candidates can now see it.');
  };

  // --- RECRUITER DASHBOARD (ENHANCED UI) ---
  if (isRecruiter) {
    return (
      <div className="relative min-h-[calc(100vh-64px)] w-full overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950 opacity-90 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20 dark:opacity-30 animate-pulse" 
            style={{ animationDuration: '10s' }}
            alt="" 
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
          
          {dashboardView === 'main' && (
            <div className="animate-fade-up">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center drop-shadow-sm">
                Welcome back, {authUser?.name.split(' ')[0]}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Non-Project Dashboard Card */}
                <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-blue-500/20"></div>
                  
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-users-viewfinder text-white text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Non-Project Dashboard</h2>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-3 text-sm text-left list-disc list-inside bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl w-full mb-8">
                      <li>Candidates and their profile</li>
                      <li>Jobs Management</li>
                    </ul>
                    <button 
                        onClick={() => setDashboardView('non-project')}
                        className="mt-auto w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <span>Click to View</span>
                      <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>

                {/* Project and Placement Dashboard Card */}
                <div className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-purple-500/20"></div>

                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-rocket text-white text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Project & Placement</h2>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-3 text-sm text-left list-disc list-inside bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl w-full mb-8">
                      <li>New Enrollments</li>
                      <li>Project Dashboard</li>
                      <li>Placement Dashboard</li>
                    </ul>
                    <button 
                        onClick={() => navigate('/project')}
                        className="mt-auto w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-purple-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <span>Click to View</span>
                      <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* KPI Dashboard Card - Centered */}
              <div className="flex justify-center">
                <div className="w-full md:w-3/5 group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
                  
                  <div className="relative z-10 flex flex-col h-full items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-chart-line text-white text-3xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">KPI Dashboard</h2>
                    <ul className="text-gray-600 dark:text-gray-300 space-y-3 text-sm text-center list-none bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl w-full mb-8">
                      <li className="font-semibold"><i className="fa-solid fa-check-circle text-green-500 mr-2"></i>Candidate Scorecards</li>
                    </ul>
                    <button 
                        onClick={() => navigate('/notifications')} 
                        className="mt-auto w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-green-600/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <span>Click to View</span>
                      <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NON-PROJECT DASHBOARD VIEW */}
          {dashboardView === 'non-project' && (
            <div className="animate-fade-up">
              <button 
                onClick={() => setDashboardView('main')}
                className="mb-8 flex items-center text-gray-500 hover:text-blue-600 font-bold transition-colors group"
              >
                <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i> Back to Dashboard
              </button>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Non-Project Dashboard Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Candidates */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer" onClick={() => navigate('/candidates')}>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 font-medium mb-2">Candidates</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{candidateCount}</span>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <i className="fa-solid fa-users text-2xl"></i>
                  </div>
                </div>

                {/* Card 2: Jobs */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer" onClick={() => navigate('/jobs')}>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 font-medium mb-2">Jobs</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{jobs.length}</span>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <i className="fa-solid fa-briefcase text-2xl"></i>
                  </div>
                </div>

                {/* Card 3: Jobs for Review */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 flex items-center justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group cursor-pointer" onClick={() => navigate('/jobs')}>
                  <div className="flex flex-col">
                    <span className="text-gray-500 dark:text-gray-400 font-medium mb-2">Jobs for Review</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white">{jobsForReviewCount}</span>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                    <i className="fa-solid fa-clipboard-check text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- CANDIDATE FEED (ORIGINAL UI) ---
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <Sidebar />
      
      <main className="flex-1 min-w-0">
        {/* Create Post Widget */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-4 shadow-sm">
          <div className="flex space-x-3 mb-3">
            <Link to="/profile">
              <img src={authUser?.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity" alt="Me" />
            </Link>
            <button 
              onClick={() => setIsPosting(true)}
              className="flex-1 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full px-6 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 transition-colors border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            >
              Start a post, {authUser?.name.split(' ')[0]}...
            </button>
          </div>
          <div className="flex justify-between items-center px-4 pt-2">
            <button onClick={() => { setPostMode('photo'); setIsPosting(true); }} className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
              <i className="fa-solid fa-image text-blue-500 text-lg"></i>
              <span className="text-sm font-semibold dark:text-gray-300">Media</span>
            </button>
            <button onClick={() => { setPostMode('event'); setIsPosting(true); }} className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
              <i className="fa-solid fa-calendar-days text-yellow-600 text-lg"></i>
              <span className="text-sm font-semibold dark:text-gray-300">Event</span>
            </button>
            <button onClick={() => { setPostMode('article'); setIsPosting(true); }} className="flex items-center space-x-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors">
              <i className="fa-solid fa-newspaper text-red-500 text-lg"></i>
              <span className="text-sm font-semibold dark:text-gray-300">Article</span>
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
          <span className="text-xs text-gray-400 uppercase font-bold px-2">Your Feed</span>
          <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1"></div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Add to your feed</h3>
            <i className="fa-solid fa-circle-info text-gray-400"></i>
          </div>
          <div className="space-y-4">
            {users.filter(u => u.id !== authUser?.id && !authUser?.following.includes(u.id)).slice(0, 3).map(u => (
              <div key={u.id} className="flex items-start space-x-3">
                <img src={u.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">{u.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{u.headline}</div>
                  <button className="flex items-center justify-center space-x-1 border border-gray-500 text-gray-600 dark:text-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-900 px-4 py-1 rounded-full text-sm font-semibold transition-all w-fit">
                    <i className="fa-solid fa-plus"></i> <span>Follow</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button className="flex items-center text-sm text-gray-500 font-semibold mt-4 hover:bg-gray-100 dark:hover:bg-gray-800 p-1 rounded transition-colors">
            View all recommendations <i className="fa-solid fa-arrow-right ml-1"></i>
          </button>
        </div>

        <div className="sticky top-20">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm p-2">
             <img src="https://picsum.photos/seed/ad/300/250" className="w-full rounded-lg" alt="Ad" />
             <div className="p-2 text-xs text-gray-400 text-center">Promoted</div>
          </div>
          
          <div className="mt-4 text-[11px] text-gray-500 dark:text-gray-400 text-center space-x-3 px-4">
            <a href="#" className="hover:text-blue-600 hover:underline">About</a>
            <a href="#" className="hover:text-blue-600 hover:underline">Accessibility</a>
            <a href="#" className="hover:text-blue-600 hover:underline">Help Center</a>
            <a href="#" className="hover:text-blue-600 hover:underline">Privacy & Terms</a>
            <p className="mt-2 text-gray-400">HireRig Corporation © 2024</p>
          </div>
        </div>
      </aside>

      {/* Post Modal */}
      {isPosting && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">Create a post</h2>
              <button onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img src={authUser?.avatar} className="w-12 h-12 rounded-full border border-gray-200" alt="Me" />
                <div>
                  <h4 className="font-bold dark:text-white">{authUser?.name}</h4>
                  <button className="text-xs font-bold text-gray-500 border border-gray-300 rounded-full px-3 py-0.5 mt-0.5 flex items-center hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                    <i className="fa-solid fa-earth-americas mr-1"></i> Anyone <i className="fa-solid fa-caret-down ml-1"></i>
                  </button>
                </div>
              </div>
              <textarea 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What do you want to talk about?" 
                className="w-full h-40 resize-none outline-none text-lg text-gray-700 dark:text-gray-200 bg-transparent placeholder:text-gray-400"
                autoFocus
              ></textarea>
              <div className="mt-4 flex items-center space-x-4">
                 <button className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><i className="fa-solid fa-image text-xl"></i></button>
                 <button className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><i className="fa-solid fa-calendar-days text-xl"></i></button>
                 <button className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors"><i className="fa-solid fa-ribbon text-xl"></i></button>
                 <div className="flex-1"></div>
                 <button 
                  onClick={handlePostSubmit}
                  disabled={!newPostContent.trim()}
                  className="bg-blue-600 text-white font-bold py-1.5 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                 >
                   Post
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
