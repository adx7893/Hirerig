
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Job } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const PostJob: React.FC = () => {
  const { addJob } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    jobTitle: '',
    isRemote: '', // 'Yes' or 'No' string for select
    employmentType: '',
    schedule: '',
    address: {
      street: '',
      city: '',
      province: '',
      country: ''
    },
    description: '',
    benefits: [] as string[],
    compensation: {
      min: '',
      max: '',
      currency: 'CAD',
      frequency: 'Annually'
    },
    skills: '',
    hiringCompany: 'Sapsol',
    companyPitch: 'Amazing Benefits, Friendly Environment',
    companyDescription: 'NA',
    resumeRequired: 'Yes',
    recipients: [] as string[],
    customRecipient: ''
  });

  const RECIPIENT_OPTIONS = [
    'Neelam Tiwari',
    'Bhargav Desai',
    'Simran Suri',
    'Jeethu Jose',
    'TEST EMP',
    'Apurva Kansara'
  ];

  const BENEFIT_OPTIONS = [
    'Medical Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401K',
    'Life Insurance',
    'None of these'
  ];

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleCompChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      compensation: { ...prev.compensation, [field]: value }
    }));
  };

  const toggleBenefit = (benefit: string) => {
    setFormData(prev => {
      if (benefit === 'None of these') {
        return { ...prev, benefits: ['None of these'] };
      }
      const newBenefits = prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits.filter(b => b !== 'None of these'), benefit];
      return { ...prev, benefits: newBenefits };
    });
  };

  const toggleRecipient = (recipient: string) => {
    setFormData(prev => {
      const newRecipients = prev.recipients.includes(recipient)
        ? prev.recipients.filter(r => r !== recipient)
        : [...prev.recipients, recipient];
      return { ...prev, recipients: newRecipients };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Map form data to Job Interface
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.jobTitle,
      company: formData.hiringCompany,
      // Construct location string for backward compatibility
      location: `${formData.address.city}, ${formData.address.province}`, 
      type: (formData.employmentType as any) || 'Full-time',
      // Construct salary string
      salary: `${formData.compensation.currency}$${formData.compensation.min} - $${formData.compensation.max}`,
      description: formData.description,
      // Parse skills string into array for requirements
      requirements: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      postedBy: user.id,
      applicants: [],
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      
      // Extended fields
      isRemote: formData.isRemote === 'Yes',
      schedule: formData.schedule,
      address: formData.address,
      benefits: formData.benefits,
      compensation: formData.compensation,
      companyPitch: formData.companyPitch,
      companyDescription: formData.companyDescription,
      resumeRequired: formData.resumeRequired === 'Yes',
      notificationEmails: [...formData.recipients, formData.customRecipient].filter(Boolean)
    };

    addJob(newJob);
    alert('Job Posted Successfully!');
    navigate('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-up pb-20">
      
      {/* Top Navigation */}
      <Link to="/jobs" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-bold text-sm">
        <i className="fa-solid fa-chevron-left mr-2"></i> Back to jobs
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">1 of 2: Job Details</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Title*</label>
            <input 
              required 
              type="text" 
              placeholder="Enter Job Title" 
              value={formData.jobTitle} 
              onChange={e => setFormData({...formData, jobTitle: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Can this job be performed remotely, meaning working from home? If so, we will add the 'Remote' tag to the job post
            </label>
            <select 
              value={formData.isRemote} 
              onChange={e => setFormData({...formData, isRemote: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Employment Type*</label>
              <select 
                required
                value={formData.employmentType} 
                onChange={e => setFormData({...formData, employmentType: e.target.value})} 
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="">Select Employment Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Schedule*</label>
              <select 
                required
                value={formData.schedule} 
                onChange={e => setFormData({...formData, schedule: e.target.value})} 
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              >
                <option value="">Select Job Schedule</option>
                <option value="8 Hour Shift">8 Hour Shift</option>
                <option value="10 Hour Shift">10 Hour Shift</option>
                <option value="Monday to Friday">Monday to Friday</option>
                <option value="Weekends Only">Weekends Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Address */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enter Street Address*</label>
            <input 
              required 
              type="text" 
              placeholder="Enter Address" 
              value={formData.address.street} 
              onChange={e => handleAddressChange('street', e.target.value)}
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">City*</label>
              <input 
                required 
                type="text" 
                placeholder="Enter City" 
                value={formData.address.city} 
                onChange={e => handleAddressChange('city', e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Province*</label>
              <input 
                required 
                type="text" 
                placeholder="Enter Province" 
                value={formData.address.province} 
                onChange={e => handleAddressChange('province', e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Country*</label>
              <input 
                required 
                type="text" 
                placeholder="Enter Country" 
                value={formData.address.country} 
                onChange={e => handleAddressChange('country', e.target.value)}
                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
              />
            </div>
          </div>
        </div>

        {/* Section 3: Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Description*</label>
          <textarea 
            required 
            rows={8} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y"
          ></textarea>
        </div>

        {/* Section 4: Benefits */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Benefits*</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BENEFIT_OPTIONS.map(benefit => (
              <label key={benefit} className="flex items-center space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.benefits.includes(benefit)} 
                  onChange={() => toggleBenefit(benefit)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">{benefit}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 5: Compensation */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Compensation Range</label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="relative w-full md:w-32">
                <select 
                  value={formData.compensation.currency} 
                  onChange={e => handleCompChange('currency', e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md font-bold dark:text-white"
                >
                  <option value="CAD">CAD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
             </div>
             
             <div className="w-full md:flex-1">
                <input 
                  type="number" 
                  placeholder="Enter Min Amount" 
                  value={formData.compensation.min}
                  onChange={e => handleCompChange('min', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
             </div>
             
             <span className="text-gray-500 font-bold">to</span>

             <div className="w-full md:flex-1">
                <input 
                  type="number" 
                  placeholder="Enter Max Amount" 
                  value={formData.compensation.max}
                  onChange={e => handleCompChange('max', e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
             </div>

             <div className="relative w-full md:w-40">
                <select 
                  value={formData.compensation.frequency} 
                  onChange={e => handleCompChange('frequency', e.target.value)}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md font-bold dark:text-white"
                >
                  <option value="Annually">Annually</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Hourly">Hourly</option>
                </select>
             </div>
          </div>
        </div>

        {/* Section 6: Skills */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Skills</label>
          <input 
            type="text" 
            placeholder="Enter desired skills (comma separated)" 
            value={formData.skills} 
            onChange={e => setFormData({...formData, skills: e.target.value})} 
            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
          />
        </div>

        {/* Section 7: Hiring Company Info */}
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
           <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Hiring Company*</label>
            <input 
              required 
              type="text" 
              value={formData.hiringCompany} 
              onChange={e => setFormData({...formData, hiringCompany: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
            />
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Why to work in this Company?</label>
             <p className="text-xs text-gray-500 mb-2">Give a one-line sales pitch for working at this company (140 characters max.). Note: editing this field will affect all jobs at this hiring company.</p>
             <input 
              type="text" 
              maxLength={140}
              value={formData.companyPitch} 
              onChange={e => setFormData({...formData, companyPitch: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
             />
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Hiring Company Description</label>
             <p className="text-xs text-gray-500 mb-2">Note: editing this description will affect all jobs at this hiring company.</p>
             <textarea 
              rows={3} 
              value={formData.companyDescription} 
              onChange={e => setFormData({...formData, companyDescription: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white resize-y"
             ></textarea>
           </div>
        </div>

        {/* Section 8: Notification & Resume */}
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-800">
           <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Do you want applicants to submit a resume*</label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="resume" 
                  value="Yes" 
                  checked={formData.resumeRequired === 'Yes'}
                  onChange={() => setFormData({...formData, resumeRequired: 'Yes'})}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Yes</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="resume" 
                  value="No" 
                  checked={formData.resumeRequired === 'No'}
                  onChange={() => setFormData({...formData, resumeRequired: 'No'})}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">No</span>
              </label>
            </div>
           </div>

           <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Send New Candidates To*</label>
            <p className="text-xs text-gray-500 mb-3">Select who should get alert emails for new candidates:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
               {RECIPIENT_OPTIONS.map(recipient => (
                 <label key={recipient} className="flex items-center space-x-3 cursor-pointer group">
                   <input 
                    type="checkbox" 
                    checked={formData.recipients.includes(recipient)} 
                    onChange={() => toggleRecipient(recipient)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                   />
                   <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">{recipient}</span>
                 </label>
               ))}
            </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Send Notification to following email id who is not in the above list</label>
             <input 
              type="email" 
              placeholder="Enter email address" 
              value={formData.customRecipient} 
              onChange={e => setFormData({...formData, customRecipient: e.target.value})} 
              className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" 
             />
           </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-xs text-gray-500">
             <a href="#" className="hover:underline hover:text-blue-600 mr-2">Privacy Policy</a> | 
             <a href="#" className="hover:underline hover:text-blue-600 ml-2">Terms and Conditions</a>
           </div>
           
           <button 
            type="submit" 
            className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-10 rounded-full hover:bg-blue-700 shadow-lg transform active:scale-95 transition-all text-sm uppercase tracking-wide"
           >
             Save & Publish Job
           </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
