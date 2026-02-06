
import React, { useState } from 'react';

interface Promotion {
  id: string;
  title: string;
  code: string;
  discount: string;
  validUntil: string;
  status: 'Active' | 'Expired' | 'Scheduled';
  description: string;
}

const MOCK_PROMOS: Promotion[] = [
  { id: '1', title: 'Summer Sale', code: 'SUMMER23', discount: '20% OFF', validUntil: '2023-08-31', status: 'Expired', description: 'Discount on all Pro plans.' },
  { id: '2', title: 'Student Discount', code: 'EDU50', discount: '50% OFF', validUntil: '2024-12-31', status: 'Active', description: 'Valid for university students with .edu email.' },
];

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOS);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    discount: '',
    validUntil: '',
    description: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newPromo: Promotion = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: 'Active'
    };
    setPromotions([newPromo, ...promotions]);
    setShowModal(false);
    setFormData({ title: '', code: '', discount: '', validUntil: '', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Promotions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage discounts and marketing codes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-purple-700 transition-all shadow-lg flex items-center"
        >
          <i className="fa-solid fa-tag mr-2"></i> New Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promo => (
          <div key={promo.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <i className="fa-solid fa-ticket text-6xl text-purple-600"></i>
            </div>
            
            <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    promo.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {promo.status}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{promo.title}</h3>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-4">{promo.discount}</p>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg flex justify-between items-center mb-4">
                <code className="text-sm font-mono font-bold text-gray-700 dark:text-gray-200">{promo.code}</code>
                <button className="text-xs text-blue-600 hover:underline">Copy</button>
            </div>

            <p className="text-xs text-gray-500 mb-4">{promo.description}</p>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs font-medium text-gray-400">
                Expires: {promo.validUntil}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Create Promotion</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Campaign Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                    <input required type="text" placeholder="e.g. SALE20" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700 font-mono" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount</label>
                    <input required type="text" placeholder="e.g. 20% OFF" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valid Until</label>
                <input required type="date" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border rounded-lg p-3 outline-none dark:text-white dark:border-gray-700 resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 mt-2">Launch Promotion</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;
