
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ManagementProject } from '../types';
import { generateProjectDetails } from '../services/geminiService';

interface Props {
  openCreate?: boolean;
}

const ProjectManagement: React.FC<Props> = ({ openCreate = false }) => {
  const { projects, addProject } = useApp();
  const [showModal, setShowModal] = useState(openCreate);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  // Detailed Form State
  const [genForm, setGenForm] = useState({
    describeProblem: '',
    industry: '',
    mainProcess: '',
    subProcess: '',
    methodology: 'Agile',
    maxDuration: '',
    durationUnit: 'Months',
    durationDesc: '',
    os: '',
    database: '',
    application: '',
    architecture: '',
    interfaces: [] as string[],
    otherIntegrations: ''
  });

  const INTERFACE_OPTIONS = ['Salesforce', 'SAP', 'Workday', 'Oracle', 'Other'];
  const INDUSTRY_OPTIONS = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Logistics', 'Education', 'Government'];
  const DURATION_UNITS = ['Weeks', 'Months', 'Years'];

  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const filteredProjects = projects.filter(p => filterStatus === 'All' || p.status === filterStatus);

  const handleInterfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGenForm(prev => {
      const newInterfaces = prev.interfaces.includes(value)
        ? prev.interfaces.filter(i => i !== value)
        : [...prev.interfaces, value];
      return { ...prev, interfaces: newInterfaces };
    });
  };

  const handleGenerateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Construct a rich prompt from the detailed form data
    const prompt = `
      Create a project blueprint based on this Business Problem:
      
      Problem Description: ${genForm.describeProblem}
      Industry: ${genForm.industry}
      Process: ${genForm.mainProcess} > ${genForm.subProcess}
      Methodology: ${genForm.methodology}
      Duration Constraints: ${genForm.maxDuration} ${genForm.durationUnit} (${genForm.durationDesc})
      
      Technology Environment:
      - OS: ${genForm.os}
      - Database: ${genForm.database}
      - Application: ${genForm.application}
      - Architecture Systems: ${genForm.architecture}
      - Interfaces: ${genForm.interfaces.join(', ')}
      - Other Integrations: ${genForm.otherIntegrations}
    `;

    const result = await generateProjectDetails(prompt);

    if (result) {
      const newProject: ManagementProject = {
        id: Math.random().toString(36).substr(2, 9),
        title: result.title || 'Generated Project',
        client: result.client || 'Internal',
        description: result.description || genForm.describeProblem,
        status: 'Planning',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 3 months
        techStack: result.techStack || [],
        team: [],
        progress: 0,
        budget: result.estimatedBudget
      };
      
      addProject(newProject);
      setShowModal(false);
      // Reset form
      setGenForm({
        describeProblem: '', industry: '', mainProcess: '', subProcess: '', methodology: 'Agile',
        maxDuration: '', durationUnit: 'Months', durationDesc: '',
        os: '', database: '', application: '', architecture: '', interfaces: [], otherIntegrations: ''
      });
    }
    setIsGenerating(false);
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
                    <img key={i} src={`https://picsum.photos/seed/${uid}/40`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" title={uid} alt="" />
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
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
               <div>
                 <h2 className="text-xl font-bold dark:text-white flex items-center">
                   Generate Project and Job Description
                 </h2>
                 <p className="text-xs text-gray-500">From Business Problem</p>
               </div>
               <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 md:p-8">
               <form id="project-form" onSubmit={handleGenerateAndSubmit} className="space-y-8">
                 
                 {/* Section 1: Problem Definition */}
                 <div className="space-y-6">
                   <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-900/50 pb-2">
                     1. Business Context
                   </h3>
                   
                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Describe Problem</label>
                      <textarea 
                        required
                        rows={3}
                        value={genForm.describeProblem}
                        onChange={(e) => setGenForm({...genForm, describeProblem: e.target.value})}
                        placeholder="e.g. Current manual inventory tracking is causing 20% stock discrepancies..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Business Area (Industry)</label>
                        <select 
                          value={genForm.industry}
                          onChange={(e) => setGenForm({...genForm, industry: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Industry</option>
                          {INDUSTRY_OPTIONS.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Methodology</label>
                        <select 
                          value={genForm.methodology}
                          onChange={(e) => setGenForm({...genForm, methodology: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Agile">Agile</option>
                          <option value="Waterfall">Waterfall</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Scrum">Scrum</option>
                          <option value="Kanban">Kanban</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Main Process</label>
                        <input 
                          type="text"
                          value={genForm.mainProcess}
                          onChange={(e) => setGenForm({...genForm, mainProcess: e.target.value})}
                          placeholder="e.g. Supply Chain"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sub Process</label>
                        <input 
                          type="text"
                          value={genForm.subProcess}
                          onChange={(e) => setGenForm({...genForm, subProcess: e.target.value})}
                          placeholder="e.g. Inventory Management"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                   </div>
                 </div>

                 {/* Section 2: Duration */}
                 <div className="space-y-6">
                   <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-900/50 pb-2">
                     2. Timeline Constraints
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max. Project Duration</label>
                        <input 
                          type="number"
                          value={genForm.maxDuration}
                          onChange={(e) => setGenForm({...genForm, maxDuration: e.target.value})}
                          placeholder="e.g. 6"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration Unit</label>
                        <select 
                          value={genForm.durationUnit}
                          onChange={(e) => setGenForm({...genForm, durationUnit: e.target.value})}
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Unit</option>
                          {DURATION_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration Description <span className="text-xs font-normal text-gray-400">(optional)</span></label>
                        <input 
                          type="text"
                          value={genForm.durationDesc}
                          onChange={(e) => setGenForm({...genForm, durationDesc: e.target.value})}
                          placeholder="e.x., Hackathon, Long-term"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                   </div>
                 </div>

                 {/* Section 3: Technology Environment */}
                 <div className="space-y-6">
                   <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border-b border-blue-100 dark:border-blue-900/50 pb-2">
                     3. Technology Environment
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Operating System</label>
                        <input 
                          type="text"
                          value={genForm.os}
                          onChange={(e) => setGenForm({...genForm, os: e.target.value})}
                          placeholder="e.g. Linux / Windows Server"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Database</label>
                        <input 
                          type="text"
                          value={genForm.database}
                          onChange={(e) => setGenForm({...genForm, database: e.target.value})}
                          placeholder="e.g. PostgreSQL, MongoDB"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Application</label>
                        <input 
                          type="text"
                          value={genForm.application}
                          onChange={(e) => setGenForm({...genForm, application: e.target.value})}
                          placeholder="e.g. Web App, Mobile App"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Architecture (No. of Systems)</label>
                        <input 
                          type="text"
                          value={genForm.architecture}
                          onChange={(e) => setGenForm({...genForm, architecture: e.target.value})}
                          placeholder="e.g. Microservices, 3-Tier"
                          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Interfaces (select multiple)</label>
                      <div className="flex flex-wrap gap-4">
                        {INTERFACE_OPTIONS.map(opt => (
                          <label key={opt} className="flex items-center space-x-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              value={opt}
                              checked={genForm.interfaces.includes(opt)}
                              onChange={handleInterfaceChange}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Other Applications / Integrations <span className="text-xs font-normal text-gray-400">(optional)</span></label>
                      <input 
                        type="text"
                        value={genForm.otherIntegrations}
                        onChange={(e) => setGenForm({...genForm, otherIntegrations: e.target.value})}
                        placeholder="e.g. Stripe, Twilio"
                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      />
                   </div>
                 </div>

               </form>
             </div>

             <div className="p-5 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shrink-0 flex justify-end">
               <button 
                 type="submit" 
                 form="project-form"
                 disabled={isGenerating || !genForm.describeProblem}
                 className="bg-blue-600 text-white font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
               >
                 {isGenerating ? (
                   <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Generating...</>
                 ) : (
                   <><i className="fa-solid fa-wand-magic-sparkles mr-2"></i> Generate Blueprint</>
                 )}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
