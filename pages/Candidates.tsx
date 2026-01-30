
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const Candidates: React.FC = () => {
  const { users } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  // Filter users to show only candidates
  const candidates = useMemo(() => {
    return users.filter(user => {
      const isCandidate = user.role === UserRole.CANDIDATE;
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            user.headline.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSkill = filterSkill ? user.skills?.some(s => s.toLowerCase().includes(filterSkill.toLowerCase())) : true;
      
      return isCandidate && matchesSearch && matchesSkill;
    });
  }, [users, searchTerm, filterSkill]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    users.filter(u => u.role === UserRole.CANDIDATE).forEach(u => {
      u.skills?.forEach(s => skills.add(s));
    });
    return Array.from(skills).sort();
  }, [users]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Candidates</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Browse and manage your talent pool. Total: {candidates.length}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Search by name or title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64 dark:text-white"
            />
          </div>
          <select 
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white cursor-pointer"
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {candidates.map(candidate => (
          <div key={candidate.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
            <div className="h-24 bg-gray-100 dark:bg-gray-800 relative">
              <img src={candidate.banner || 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop'} className="w-full h-full object-cover opacity-80" alt="" />
              {candidate.isLookingForJob && (
                 <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                   OPEN TO WORK
                 </div>
              )}
            </div>
            
            <div className="px-6 relative flex-1 flex flex-col">
              <div className="-mt-10 mb-3">
                <img 
                  src={candidate.avatar} 
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 object-cover bg-white dark:bg-gray-800" 
                  alt={candidate.name} 
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/profile/${candidate.id}`)}>
                  {candidate.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2 line-clamp-2 min-h-[2.5em]">
                  {candidate.headline}
                </p>
                
                {candidate.experience && candidate.experience.length > 0 ? (
                  <p className="text-xs text-gray-700 dark:text-gray-300 flex items-center mt-2">
                    <i className="fa-solid fa-briefcase text-gray-400 mr-2"></i>
                    <span className="truncate">{candidate.experience[0].title} at {candidate.experience[0].company}</span>
                  </p>
                ) : (
                   <p className="text-xs text-gray-400 mt-2 flex items-center"><i className="fa-solid fa-briefcase text-gray-400 mr-2"></i> No experience listed</p>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <i className="fa-solid fa-location-dot text-gray-400 mr-2 w-3 text-center"></i>
                  {candidate.experience?.[0]?.location || 'Remote'}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 mb-6">
                 <div className="flex flex-wrap gap-1.5 mb-4 max-h-16 overflow-hidden">
                   {candidate.skills?.slice(0, 4).map((skill, i) => (
                     <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] font-bold rounded">
                       {skill}
                     </span>
                   ))}
                   {(candidate.skills?.length || 0) > 4 && (
                     <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-400 text-[10px] font-bold rounded">+{candidate.skills!.length - 4}</span>
                   )}
                 </div>
                 
                 <button 
                  onClick={() => navigate(`/profile/${candidate.id}`)}
                  className="w-full py-2 border border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                 >
                   View Profile
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {candidates.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <i className="fa-solid fa-user-slash text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No candidates found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
