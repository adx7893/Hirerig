
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ManagementProject } from '../types';
import { generateProjectDetails } from '../services/geminiService';

interface Props {
  openCreate?: boolean;
}

const ProjectManagement: React.FC<Props> = ({ openCreate = false }) => {
  const { projects, users, addProject } = useApp();
  const [showModal, setShowModal] = useState(openCreate);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    status: 'Planning' as const,
    deadline: '',
    techStackInput: '',
    budget: '',
    ideaInput: '' // For AI generation
  });

  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  
  const filteredProjects = projects.filter(p => filterStatus === 'All' || p.status === filterStatus);

  const handleGenerate = async () => {
    if (!formData.ideaInput) return;
    setIsGenerating(true);
    const result = await generateProjectDetails(formData.ideaInput);
    if (result) {
      setFormData(prev => ({
        ...prev,
        title: result.title || prev.title,
        client: result.client || prev.client,
        description: result.description || prev.description,
        techStackInput: result.techStack?.join(', ') || prev.techStackInput,
        budget: result.estimatedBudget || prev.budget,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Dummy 3 month deadline
      }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: ManagementProject = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      client: formData.client,
      description: formData.description,
      status: formData.status,
      deadline: formData.deadline,
      techStack: formData.techStackInput.split(',').map(s => s.trim()).filter(s => s),
      team: [], // Logic to assign team would go here
      progress: 0,
      budget: formData.budget
    };
    addProject(newProject);
    setShowModal(false);
    setFormData({
      title: '', client: '', description: '', status: 'Planning', 
      deadline: '', techStackInput: '', budget: '', ideaInput: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      {/* Header Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Oversee active developments and generate new project blueprints.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i> Generate Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{projects.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600"><i className="fa-solid fa-folder-open text-xl"></i></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{activeProjects}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-green-600"><i className="fa-solid fa-bolt text-xl"></i></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">{completedProjects}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600"><i className="fa-solid fa-check-double text-xl"></i></div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {['All', 'In Progress', 'Planning', 'Completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
              filterStatus === status 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' 
              : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                project.status === 'In Progress' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                project.status === 'Planning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                project.status === 'Completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-gray-100 text-gray-600'
              }`}>
                {project.status}
              </span>
              <button className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{project.title}</h3>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">{project.client}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
              {project.description}
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 3).map((tech, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] rounded border border-gray-200 dark:border-gray-700">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex -space-x-2">
                  {project.team.map((uid, i) => (
                    <img key={i} src={`https://picsum.photos/seed/${uid}/40`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" title={uid} />
                  ))}
                  <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs text-gray-500">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
                <span className="text-xs text-gray-400 font-medium">Due: {project.deadline}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Generate/Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden">
             <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
               <h2 className="text-xl font-bold dark:text-white flex items-center">
                 <i className="fa-solid fa-wand-magic-sparkles text-blue-600 mr-2"></i> Generate Project
               </h2>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
             </div>
             
             <div className="p-6 overflow-y-auto max-h-[75vh]">
               {/* AI Input Section */}
               <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 mb-6">
                 <label className="block text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase mb-2">
                   What kind of project do you want to create?
                 </label>
                 <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="e.g. A ride-sharing mobile app for pet owners"
                      value={formData.ideaInput}
                      onChange={(e) => setFormData({...formData, ideaInput: e.target.value})}
                      className="flex-1 bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={isGenerating || !formData.ideaInput}
                      className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center min-w-[100px] justify-center"
                    >
                      {isGenerating ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Auto-Fill'}
                    </button>
                 </div>
                 <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-2">
                   Powered by Google Gemini. Enter an idea and click "Auto-Fill" to generate realistic details.
                 </p>
               </div>

               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Project Title</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Client Name</label>
                      <input 
                        required
                        value={formData.client}
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full h-24 bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tech Stack (comma sep)</label>
                      <input 
                        required
                        value={formData.techStackInput}
                        onChange={(e) => setFormData({...formData, techStackInput: e.target.value})}
                        placeholder="React, Node, SQL..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deadline</label>
                      <input 
                        type="date"
                        required
                        value={formData.deadline}
                        onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estimated Budget</label>
                    <input 
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="$0.00"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
                    />
                 </div>

                 <div className="pt-4 flex justify-end">
                   <button type="submit" className="bg-blue-600 text-white font-bold py-2.5 px-8 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                     Create Project
                   </button>
                 </div>
               </form>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
