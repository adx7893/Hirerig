
import React, { useState } from 'react';

const KANBAN_DATA = {
  todo: [
    { id: '101', name: 'Alice Johnson', role: 'Frontend Dev', score: 85 },
    { id: '102', name: 'Bob Smith', role: 'Backend Dev', score: 72 },
  ],
  inProgress: [
    { id: '103', name: 'Charlie Brown', role: 'Designer', score: 91 },
    { id: '104', name: 'Diana Prince', role: 'Product Manager', score: 88 },
  ],
  interview: [
    { id: '105', name: 'Evan Wright', role: 'DevOps', score: 95 },
  ],
  hired: [
    { id: '106', name: 'Fiona Green', role: 'QA Engineer', score: 89 },
  ]
};

const ApplicationManagement: React.FC = () => {
  const [columns, setColumns] = useState(KANBAN_DATA);

  // Simplified drag and drop simulation (actual DnD requires a library like react-beautiful-dnd)
  // Here we just render the lists.

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 h-[calc(100vh-64px)] flex flex-col animate-fade-up">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Application Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track candidates through the hiring pipeline.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <i className="fa-solid fa-gear mr-2"></i> Configure Pipeline
          </button>
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
            <i className="fa-solid fa-plus mr-2"></i> Add Candidate
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex space-x-6 min-w-max h-full">
          {/* TO REVIEW */}
          <KanbanColumn 
            title="To Review" 
            count={columns.todo.length} 
            items={columns.todo} 
            color="border-yellow-400" 
            bg="bg-yellow-50 dark:bg-yellow-900/10"
          />
          
          {/* SCREENING */}
          <KanbanColumn 
            title="Screening" 
            count={columns.inProgress.length} 
            items={columns.inProgress} 
            color="border-blue-400" 
            bg="bg-blue-50 dark:bg-blue-900/10"
          />

          {/* INTERVIEW */}
          <KanbanColumn 
            title="Interview" 
            count={columns.interview.length} 
            items={columns.interview} 
            color="border-purple-400" 
            bg="bg-purple-50 dark:bg-purple-900/10"
          />

          {/* HIRED */}
          <KanbanColumn 
            title="Hired" 
            count={columns.hired.length} 
            items={columns.hired} 
            color="border-green-400" 
            bg="bg-green-50 dark:bg-green-900/10"
          />
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, count, items, color, bg }: { title: string, count: number, items: any[], color: string, bg: string }) => (
  <div className={`w-80 flex flex-col rounded-xl bg-gray-100 dark:bg-gray-900 border-t-4 ${color} shadow-sm max-h-full`}>
    <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
      <h3 className="font-bold text-gray-700 dark:text-gray-200">{title}</h3>
      <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold px-2 py-1 rounded-full shadow-sm">{count}</span>
    </div>
    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
      {items.map(item => (
        <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-2">
            <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
            <button className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-ellipsis"></i></button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{item.role}</p>
          <div className="flex justify-between items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {item.name.charAt(0)}
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded ${item.score > 90 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              Score: {item.score}%
            </div>
          </div>
        </div>
      ))}
      <button className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors text-sm font-bold">
        + Add Task
      </button>
    </div>
  </div>
);

export default ApplicationManagement;
