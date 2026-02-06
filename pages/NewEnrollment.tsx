
import React, { useState } from 'react';

const NewEnrollment: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Candidate',
    program: '',
    startDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', role: 'Candidate', program: '', startDate: '' });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">New Enrollment</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manually onboard a new candidate or student into the system.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Progress Bar (Simulated) */}
        <div className="h-2 bg-gray-100 dark:bg-gray-800 w-full">
          <div className="h-full bg-blue-600 w-1/3"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
              <input 
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                placeholder="Jane"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
              <input 
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-3.5 text-gray-400"></i>
                <input 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  type="email" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                  placeholder="jane.doe@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-4 top-3.5 text-gray-400"></i>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel" 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
              <i className="fa-solid fa-graduation-cap mr-2"></i> Program Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-2">Enrolling In</label>
                <select 
                  name="program"
                  required
                  value={formData.program}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                >
                  <option value="">Select a Program</option>
                  <option value="Full Stack Dev">Full Stack Development</option>
                  <option value="Data Science">Data Science Bootcamp</option>
                  <option value="UX Design">UX/UI Design Masterclass</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-2">Start Date</label>
                <input 
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  type="date" 
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isLoading || success}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-95 flex items-center justify-center ${
                success 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : success ? (
                <><i className="fa-solid fa-check mr-2"></i> Enrolled Successfully!</>
              ) : (
                'Submit Enrollment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEnrollment;
