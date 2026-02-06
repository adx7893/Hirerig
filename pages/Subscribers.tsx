
import React, { useState } from 'react';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'Active' | 'Inactive';
  joinedDate: string;
}

const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: '1', email: 'john@example.com', name: 'John Doe', plan: 'Pro', status: 'Active', joinedDate: '2023-10-01' },
  { id: '2', email: 'jane@company.com', name: 'Jane Smith', plan: 'Enterprise', status: 'Active', joinedDate: '2023-09-15' },
  { id: '3', email: 'bob@test.com', name: 'Bob Wilson', plan: 'Free', status: 'Inactive', joinedDate: '2023-11-05' },
];

const Subscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(MOCK_SUBSCRIBERS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: 'Free',
    status: 'Active'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newSub: Subscriber = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      plan: formData.plan as any,
      status: formData.status as any,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setSubscribers([newSub, ...subscribers]);
    setShowModal(false);
    setFormData({ name: '', email: '', plan: 'Free', status: 'Active' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscribers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage newsletter and platform subscriptions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center"
        >
          <i className="fa-solid fa-plus mr-2"></i> Add Subscriber
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{sub.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{sub.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      sub.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                      sub.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs font-bold ${sub.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${sub.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{sub.joinedDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors"><i className="fa-solid fa-pen-to-square"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {subscribers.length === 0 && <div className="p-8 text-center text-gray-500">No subscribers found.</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Add New Subscriber</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan</label>
                  <select value={formData.plan} onChange={e => setFormData({...formData, plan: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700">
                    <option value="Free">Free</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 mt-2">Create Subscriber</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers;
