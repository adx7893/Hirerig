
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Experience, Education, Project, User, UserRole } from '../types';
import { optimizeBio, generateResume } from '../services/geminiService';

type ModalType = 'experience' | 'education' | 'skills' | 'projects' | 'openToWork' | 'analytics' | null;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const { users, toggleFollow, toggleConnect, updateUserProfile, sendMessage } = useApp();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isBuildingResume, setIsBuildingResume] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeContent, setResumeContent] = useState<string>('');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  
  // State to track if we are editing a specific item (Experience/Education)
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const moreMenuRef = useRef<HTMLDivElement>(null);
  
  const profileUser = useMemo(() => {
    const id = userId || authUser?.id;
    return users.find(u => u.id === id) || authUser;
  }, [userId, authUser, users]);

  const isOwnProfile = !userId || userId === authUser?.id;

  const [editData, setEditData] = useState({
    name: '',
    headline: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    softSkills: '',
    technicalSkills: '',
    isLookingForJob: false,
  });

  // Forms for adding/editing sections
  const [expForm, setExpForm] = useState({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
  const [eduForm, setEduForm] = useState({ school: '', degree: '', field: '', startDate: '', endDate: '' });
  const [projForm, setProjForm] = useState({ name: '', description: '', link: '', startDate: '', endDate: '' });

  // Preferences for Open to Work
  const [otwPrefs, setOtwPrefs] = useState({
    titles: ['Software Engineer', 'Frontend Developer'],
    locations: ['Remote', 'San Francisco, CA'],
    types: ['Full-time', 'Contract']
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (profileUser) {
      setEditData({
        name: profileUser.name || '',
        headline: profileUser.headline || '',
        email: profileUser.email || '',
        phone: profileUser.phone || '',
        location: profileUser.location || '',
        bio: profileUser.bio || '',
        softSkills: profileUser.softSkills?.join(', ') || '',
        technicalSkills: profileUser.technicalSkills?.join(', ') || profileUser.skills?.join(', ') || '',
        isLookingForJob: profileUser.isLookingForJob || false,
      });
    }
  }, [profileUser]);

  if (!profileUser) return <div className="p-10 text-center text-gray-900 dark:text-gray-100">User not found.</div>;

  const handleSyncUpdate = (data: Partial<User>) => {
    updateUser(data);
    if (authUser) updateUserProfile(authUser.id, data);
  };

  const handleUpdateAvatar = () => {
    if (!isOwnProfile) return;
    const url = prompt("Enter profile image URL:");
    if (url) handleSyncUpdate({ avatar: url });
  };

  const handleUpdateBanner = () => {
    if (!isOwnProfile) return;
    const url = prompt("Enter banner image URL:");
    if (url) handleSyncUpdate({ banner: url });
  };

  const handleOptimizeBio = async () => {
    if (!editData.bio || !isOwnProfile) return;
    setIsOptimizing(true);
    const optimized = await optimizeBio(editData.bio, editData.headline);
    setEditData(prev => ({ ...prev, bio: optimized || prev.bio }));
    setIsOptimizing(false);
  };

  // --- Resume Logic ---

  const handleBuildResume = async () => {
    if (!profileUser) return;
    setIsBuildingResume(true);
    setShowMoreMenu(false);
    try {
      // Ensure we are using the most up-to-date data for generation if changes were made locally
      const updatedUser = {
        ...profileUser,
        ...editData, // Use current edit form data if available
        softSkills: editData.softSkills.split(',').map(s => s.trim()).filter(Boolean),
        technicalSkills: editData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const result = await generateResume(updatedUser);
      setResumeContent(result || 'Unable to generate resume at this time.');
      setShowResumeModal(true);
    } catch (error) {
      alert("Failed to build resume.");
    } finally {
      setIsBuildingResume(false);
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Resume</title>');
      // Add basic styling for the print window to handle markdown-like text
      printWindow.document.write(`
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          h1, h2, h3 { color: #111; margin-top: 20px; margin-bottom: 10px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 5px; }
          .content { white-space: pre-wrap; font-family: monospace; }
        </style>
      `);
      printWindow.document.write('</head><body>');
      // We wrap it in a pre-wrap div to preserve the structure returned by Gemini
      printWindow.document.write(`<div class="content">${resumeContent}</div>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  // --- Main Profile Edit Logic ---

  const handleSaveMain = () => {
    handleSyncUpdate({
      name: editData.name,
      headline: editData.headline,
      email: editData.email,
      phone: editData.phone,
      location: editData.location,
      bio: editData.bio,
      softSkills: editData.softSkills.split(',').map(s => s.trim()).filter(s => s),
      technicalSkills: editData.technicalSkills.split(',').map(s => s.trim()).filter(s => s),
      // Sync legacy skills field for backward compatibility
      skills: editData.technicalSkills.split(',').map(s => s.trim()).filter(s => s),
      isLookingForJob: editData.isLookingForJob
    });
    setIsEditing(false);
  };

  // --- Experience Logic ---

  const openAddExperience = () => {
    setExpForm({ title: '', company: '', location: '', startDate: '', endDate: '', description: '' });
    setEditingId(null);
    setActiveModal('experience');
  };

  const openEditExperience = (exp: Experience) => {
    setExpForm({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description
    });
    setEditingId(exp.id);
    setActiveModal('experience');
  };

  const handleDeleteExperience = (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      const currentExp = profileUser.experience || [];
      handleSyncUpdate({ experience: currentExp.filter(e => e.id !== id) });
    }
  };

  const handleSaveExperience = () => {
    const currentExp = profileUser.experience || [];
    let updatedExp: Experience[];

    if (editingId) {
      // Update existing
      updatedExp = currentExp.map(e => 
        e.id === editingId ? { ...expForm, id: editingId } : e
      );
    } else {
      // Add new
      const newExp: Experience = { ...expForm, id: Math.random().toString(36).substr(2, 9) };
      updatedExp = [newExp, ...currentExp];
    }

    handleSyncUpdate({ experience: updatedExp });
    setActiveModal(null);
  };

  // --- Education Logic ---

  const openAddEducation = () => {
    setEduForm({ school: '', degree: '', field: '', startDate: '', endDate: '' });
    setEditingId(null);
    setActiveModal('education');
  };

  const openEditEducation = (edu: Education) => {
    setEduForm({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate || ''
    });
    setEditingId(edu.id);
    setActiveModal('education');
  };

  const handleDeleteEducation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      const currentEdu = profileUser.education || [];
      handleSyncUpdate({ education: currentEdu.filter(e => e.id !== id) });
    }
  };

  const handleSaveEducation = () => {
    const currentEdu = profileUser.education || [];
    let updatedEdu: Education[];

    if (editingId) {
      // Update existing
      updatedEdu = currentEdu.map(e => 
        e.id === editingId ? { ...eduForm, id: editingId } : e
      );
    } else {
      // Add new
      const newEdu: Education = { ...eduForm, id: Math.random().toString(36).substr(2, 9) };
      updatedEdu = [newEdu, ...currentEdu];
    }

    handleSyncUpdate({ education: updatedEdu });
    setActiveModal(null);
  };

  // --- Open To Work Logic ---

  const handleSaveOtw = () => {
    handleSyncUpdate({ isLookingForJob: true });
    setActiveModal(null);
  };

  const handleRemoveOtw = () => {
    handleSyncUpdate({ isLookingForJob: false });
    setActiveModal(null);
  };

  const handleAddTitle = () => {
    const title = prompt("Add job title:");
    if (title) {
      setOtwPrefs(prev => ({ ...prev, titles: [...prev.titles, title] }));
    }
  };

  const handleRemoveTitle = (index: number) => {
    setOtwPrefs(prev => ({
      ...prev,
      titles: prev.titles.filter((_, i) => i !== index)
    }));
  };

  const handleAddLocation = () => {
    const loc = prompt("Add location preference:");
    if (loc) {
      setOtwPrefs(prev => ({ ...prev, locations: [...prev.locations, loc] }));
    }
  };

  const handleRemoveLocation = (index: number) => {
    setOtwPrefs(prev => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index)
    }));
  };

  const handleMessage = () => {
    if (!authUser) return;
    navigate('/messaging');
  };

  const isFollowing = authUser?.following?.includes(profileUser.id);
  const isConnected = authUser?.connections?.includes(profileUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
        <div className="h-48 w-full relative group">
          <img 
            src={profileUser.banner || 'https://picsum.photos/seed/defaultbanner/1200/400'} 
            className="w-full h-full object-cover" 
            alt="Banner" 
          />
          {isOwnProfile && (
            <button 
              onClick={handleUpdateBanner}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i className="fa-solid fa-camera text-blue-600"></i>
            </button>
          )}
          
          <div className="absolute -bottom-16 left-6 group/avatar">
            <div className="relative">
              <img 
                src={profileUser.avatar} 
                className="w-36 h-36 rounded-full border-4 border-white dark:border-gray-900 object-cover shadow-xl bg-white dark:bg-gray-800" 
                alt="Avatar" 
              />
              {/* LinkedIn Style Frame for Open to Work */}
              {profileUser.isLookingForJob && (
                <div className="absolute inset-0 rounded-full border-[6px] border-[#01754f] pointer-events-none">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#01754f] text-white text-[8px] font-black px-2 py-0.5 rounded-t-sm uppercase tracking-tighter shadow-sm">
                    #OpenToWork
                  </div>
                </div>
              )}
              {isOwnProfile && (
                <button 
                  onClick={handleUpdateAvatar}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
                >
                  <i className="fa-solid fa-camera"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-20 pb-6 px-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
                {profileUser.role === UserRole.RECRUITER && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Recruiter</span>
                )}
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">{profileUser.headline}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-col gap-1">
                 <span>{profileUser.location || profileUser.experience?.[0]?.location || 'Location not set'}</span>
                 <span className="text-blue-600 dark:text-blue-400 font-bold cursor-pointer hover:underline">
                  {profileUser.connections.length} connections
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setActiveModal('openToWork')}
                    className="bg-blue-600 text-white font-bold px-5 py-1.5 rounded-full text-sm hover:bg-blue-700 transition-all shadow-md"
                  >
                    Open to
                  </button>
                  <button 
                    onClick={handleBuildResume}
                    disabled={isBuildingResume}
                    className="border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold px-5 py-1.5 rounded-full text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center"
                  >
                    {isBuildingResume ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>}
                    AI Resume
                  </button>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="border border-gray-600 text-gray-600 dark:border-gray-400 dark:text-gray-400 font-bold px-5 py-1.5 rounded-full text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => toggleConnect(authUser!.id, profileUser.id)}
                    className={`${isConnected ? 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300' : 'bg-blue-600 text-white'} font-bold px-5 py-1.5 rounded-full text-sm transition-all shadow-md`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                  <button 
                    onClick={handleMessage}
                    className="border border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 font-bold px-5 py-1.5 rounded-full text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    Message
                  </button>
                </>
              )}
              
              <div className="relative" ref={moreMenuRef}>
                <button 
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <button 
                      onClick={handleBuildResume}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <i className="fa-solid fa-file-pdf mr-2"></i>
                      Generate Resume
                    </button>
                    {!isOwnProfile && (
                      <button 
                        onClick={() => toggleFollow(authUser!.id, profileUser.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
                      >
                        <i className={`fa-solid ${isFollowing ? 'fa-user-minus' : 'fa-user-plus'} mr-2`}></i>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </button>
                    )}
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                      <i className="fa-solid fa-share-nodes mr-2"></i> Share via message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Open to Work Display */}
          {profileUser.isLookingForJob && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl relative group">
              {isOwnProfile && (
                <button 
                  onClick={() => setActiveModal('openToWork')}
                  className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <i className="fa-solid fa-pen text-sm"></i>
                </button>
              )}
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Open to work</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                {otwPrefs.titles.join(', ')} roles
              </p>
              <button 
                onClick={() => setActiveModal('openToWork')}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline mt-2 block"
              >
                See all details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* About Section (Summary) */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Summary</h3>
          {isOwnProfile && (
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 transition-colors">
              <i className="fa-solid fa-pen"></i>
            </button>
          )}
        </div>
        {profileUser.bio ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {profileUser.bio}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">No summary provided yet.</p>
        )}
      </div>

      {/* Skills Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Technical Skills */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Technical Skills</h3>
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 text-sm">
                <i className="fa-solid fa-pen"></i>
              </button>
            )}
           </div>
           <div className="flex flex-wrap gap-2">
             {profileUser.technicalSkills && profileUser.technicalSkills.length > 0 ? (
               profileUser.technicalSkills.map((skill, i) => (
                 <span key={i} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-xs border border-indigo-100 dark:border-indigo-900/50">
                   {skill}
                 </span>
               ))
             ) : (
                profileUser.skills && profileUser.skills.length > 0 ? (
                    // Fallback to legacy skills if technicalSkills empty
                    profileUser.skills.map((skill, i) => (
                      <span key={i} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold px-3 py-1 rounded-full text-xs border border-indigo-100 dark:border-indigo-900/50">
                        {skill}
                      </span>
                    ))
                ) : (
                    <p className="text-sm text-gray-400 italic">No technical skills listed.</p>
                )
             )}
           </div>
        </div>

        {/* Soft Skills */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Soft Skills</h3>
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 text-sm">
                <i className="fa-solid fa-pen"></i>
              </button>
            )}
           </div>
           <div className="flex flex-wrap gap-2">
             {profileUser.softSkills && profileUser.softSkills.length > 0 ? (
               profileUser.softSkills.map((skill, i) => (
                 <span key={i} className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold px-3 py-1 rounded-full text-xs border border-green-100 dark:border-green-900/50">
                   {skill}
                 </span>
               ))
             ) : (
               <p className="text-sm text-gray-400 italic">No soft skills listed.</p>
             )}
           </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Experience</h3>
          {isOwnProfile && (
            <button 
              onClick={openAddExperience}
              className="text-gray-400 hover:text-blue-600 text-xl transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          )}
        </div>
        <div className="space-y-8">
          {profileUser.experience && profileUser.experience.length > 0 ? (
            profileUser.experience.map((exp) => (
              <div key={exp.id} className="flex space-x-4 group relative">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
                  <i className="fa-solid fa-building text-2xl"></i>
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 group-last:pb-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                    {isOwnProfile && (
                      <div className="flex space-x-2">
                        <button onClick={() => openEditExperience(exp)} className="text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => handleDeleteExperience(exp.id)} className="text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{exp.company}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {exp.startDate} — {exp.endDate || 'Present'} • {exp.location}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-wrap">{exp.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No experience added yet.</p>
          )}
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Education</h3>
          {isOwnProfile && (
            <button 
              onClick={openAddEducation}
              className="text-gray-400 hover:text-blue-600 text-xl transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          )}
        </div>
        <div className="space-y-8">
          {profileUser.education && profileUser.education.length > 0 ? (
            profileUser.education.map((edu) => (
              <div key={edu.id} className="flex space-x-4 relative">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
                  <i className="fa-solid fa-graduation-cap text-2xl"></i>
                </div>
                <div className="flex-1 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{edu.school}</h4>
                    {isOwnProfile && (
                      <div className="flex space-x-2">
                        <button onClick={() => openEditEducation(edu)} className="text-gray-400 hover:text-blue-600"><i className="fa-solid fa-pen"></i></button>
                        <button onClick={() => handleDeleteEducation(edu.id)} className="text-gray-400 hover:text-red-600"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{edu.degree}, {edu.field}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {edu.startDate} — {edu.endDate || 'Present'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No education added yet.</p>
          )}
        </div>
      </div>

      {/* Edit Main Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 transition-colors">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold dark:text-white">Edit Profile & Resume Info</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={editData.name} 
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline</label>
                  <input 
                    type="text" 
                    value={editData.headline} 
                    onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editData.email} 
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input 
                    type="tel" 
                    value={editData.phone} 
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                <input 
                  type="text" 
                  value={editData.location} 
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Professional Summary</label>
                  <button 
                    onClick={handleOptimizeBio}
                    disabled={isOptimizing || !editData.bio}
                    className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded hover:bg-indigo-100 disabled:opacity-50 flex items-center"
                  >
                    {isOptimizing ? <i className="fa-solid fa-spinner fa-spin mr-1"></i> : <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>}
                    AI Optimize
                  </button>
                </div>
                <textarea 
                  value={editData.bio} 
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  className="w-full h-32 bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Technical Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editData.technicalSkills} 
                    onChange={(e) => setEditData({ ...editData, technicalSkills: e.target.value })}
                    placeholder="React, AWS, Java..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Soft Skills (Comma separated)</label>
                  <input 
                    type="text" 
                    value={editData.softSkills} 
                    onChange={(e) => setEditData({ ...editData, softSkills: e.target.value })}
                    placeholder="Communication, Leadership..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" 
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-800 flex justify-end bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={handleSaveMain}
                className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {activeModal === 'experience' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                type="text" placeholder="Title" value={expForm.title} 
                onChange={(e) => setExpForm({...expForm, title: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" placeholder="Company" value={expForm.company} 
                onChange={(e) => setExpForm({...expForm, company: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Start (e.g. 2021-01)" value={expForm.startDate} 
                  onChange={(e) => setExpForm({...expForm, startDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  type="text" placeholder="End (Present if blank)" value={expForm.endDate} 
                  onChange={(e) => setExpForm({...expForm, endDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <textarea 
                placeholder="Description" value={expForm.description} 
                onChange={(e) => setExpForm({...expForm, description: e.target.value})}
                className="w-full h-32 bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
              />
            </div>
            <div className="p-4 border-t dark:border-gray-800 flex justify-end">
              <button onClick={handleSaveExperience} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700">
                {editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Education Modal */}
      {activeModal === 'education' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? 'Edit Education' : 'Add Education'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <input 
                type="text" placeholder="School / University" value={eduForm.school} 
                onChange={(e) => setEduForm({...eduForm, school: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" placeholder="Degree" value={eduForm.degree} 
                onChange={(e) => setEduForm({...eduForm, degree: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" placeholder="Field of Study" value={eduForm.field} 
                onChange={(e) => setEduForm({...eduForm, field: e.target.value})}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Start (e.g. 2018-09)" value={eduForm.startDate} 
                  onChange={(e) => setEduForm({...eduForm, startDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  type="text" placeholder="End (e.g. 2022-05)" value={eduForm.endDate} 
                  onChange={(e) => setEduForm({...eduForm, endDate: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-800 flex justify-end">
              <button onClick={handleSaveEducation} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700">
                {editingId ? 'Save' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open to Work Modal */}
      {activeModal === 'openToWork' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold dark:text-white">Job preferences</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Titles</label>
                <div className="flex flex-wrap gap-2">
                  {otwPrefs.titles.map((title, i) => (
                    <span key={i} className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full flex items-center group/tag">
                      {title} 
                      <button onClick={() => handleRemoveTitle(i)} className="ml-2 hover:text-blue-800 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  ))}
                  <button onClick={handleAddTitle} className="text-xs text-blue-600 font-bold border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">+ Add title</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Workplaces</label>
                <div className="flex flex-wrap gap-2">
                  {otwPrefs.locations.map((loc, i) => (
                    <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full flex items-center group/tag">
                      {loc} 
                      <button onClick={() => handleRemoveLocation(i)} className="ml-2 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </span>
                  ))}
                  <button onClick={handleAddLocation} className="text-xs text-blue-600 font-bold border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors">+ Add location</button>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-full border-2 border-green-600 flex items-center justify-center text-green-600 bg-white dark:bg-gray-900 overflow-hidden">
                    <img src={profileUser.avatar} className="w-full h-full object-cover grayscale opacity-50" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-green-800 dark:text-green-300">Profile Frame enabled</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400">The #OpenToWork frame will be added to your profile photo to let recruiters know you're hiring.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={handleRemoveOtw}
                className="text-gray-500 hover:text-red-600 text-sm font-bold transition-colors"
              >
                Remove from profile
              </button>
              <button onClick={handleSaveOtw} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all active:scale-95">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 max-h-[90vh] flex flex-col transition-colors">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2 text-indigo-600">
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
                <h2 className="text-xl font-black uppercase tracking-tight">AI Tailored Resume</h2>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleDownloadPDF} 
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  <i className="fa-solid fa-download mr-1"></i> Download PDF
                </button>
                <button onClick={() => setShowResumeModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950 font-serif">
              <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 p-10 shadow-lg border border-gray-100 dark:border-gray-800 prose dark:prose-invert">
                <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                  {resumeContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
