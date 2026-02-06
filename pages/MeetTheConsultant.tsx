
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// --- Types & Mock Data for this specific page ---
interface Consultant {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  specialty: 'Career Coaching' | 'Mock Interview' | 'Resume Review' | 'Salary Negotiation';
  rating: number;
  reviews: number;
  rate: number;
  available: boolean;
  tags: string[];
}

const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: 'c1',
    name: 'Alexandra Chen',
    title: 'Senior Tech Recruiter',
    company: 'Google',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    specialty: 'Mock Interview',
    rating: 4.9,
    reviews: 124,
    rate: 120,
    available: true,
    tags: ['Tech', 'FAANG', 'Behavioral']
  },
  {
    id: 'c2',
    name: 'Marcus Johnson',
    title: 'Head of Talent',
    company: 'Startup Inc',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop',
    specialty: 'Resume Review',
    rating: 4.8,
    reviews: 89,
    rate: 90,
    available: true,
    tags: ['ATS Optimization', 'Leadership']
  },
  {
    id: 'c3',
    name: 'Sarah Miller',
    title: 'Career Coach',
    company: 'Freelance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    specialty: 'Career Coaching',
    rating: 5.0,
    reviews: 42,
    rate: 150,
    available: false,
    tags: ['Transition', 'Executive']
  },
  {
    id: 'c4',
    name: 'David Kim',
    title: 'Compensation Analyst',
    company: 'FinTech Corp',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    specialty: 'Salary Negotiation',
    rating: 4.7,
    reviews: 15,
    rate: 200,
    available: true,
    tags: ['Equity', 'Offers']
  },
  {
    id: 'c5',
    name: 'Emily Davis',
    title: 'Hiring Manager',
    company: 'CloudScale',
    avatar: 'https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?q=80&w=200&auto=format&fit=crop',
    specialty: 'Mock Interview',
    rating: 4.9,
    reviews: 210,
    rate: 110,
    available: true,
    tags: ['System Design', 'Backend']
  },
  {
    id: 'c6',
    name: 'Michael Brown',
    title: 'Resume Writer',
    company: 'The Word Smith',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    specialty: 'Resume Review',
    rating: 4.6,
    reviews: 330,
    rate: 75,
    available: true,
    tags: ['Cover Letters', 'LinkedIn']
  }
];

const MeetTheConsultant: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [bookingStep, setBookingStep] = useState<'date' | 'confirm' | 'success'>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const categories = ['All', 'Mock Interview', 'Resume Review', 'Career Coaching', 'Salary Negotiation'];

  const filteredConsultants = useMemo(() => {
    if (activeCategory === 'All') return MOCK_CONSULTANTS;
    return MOCK_CONSULTANTS.filter(c => c.specialty === activeCategory);
  }, [activeCategory]);

  const handleBookClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setBookingStep('date');
    setSelectedDate('');
    setSelectedTime('');
  };

  const confirmBooking = () => {
    setBookingStep('success');
    // In a real app, API call to book goes here
  };

  const closeBooking = () => {
    setSelectedConsultant(null);
    setBookingStep('date');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-up min-h-screen">
      
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
          Meet the Consultants <span className="text-blue-600">.</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
          Accelerate your career with 1-on-1 sessions from industry experts. 
          Book mock interviews, resume reviews, and coaching sessions instantly.
        </p>
      </div>

      {/* Categories / Filters */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-blue-500/30'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConsultants.map(consultant => (
          <div key={consultant.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
            
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={consultant.avatar} alt={consultant.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md" />
                  {consultant.available && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" title="Available Now"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{consultant.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{consultant.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">at {consultant.company}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center text-yellow-500 font-bold text-sm">
                  <i className="fa-solid fa-star mr-1"></i> {consultant.rating}
                </div>
                <div className="text-[10px] text-gray-400">({consultant.reviews} reviews)</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {consultant.specialty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {consultant.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-gray-900 dark:text-white">${consultant.rate}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">/hr</span>
              </div>
              <button 
                onClick={() => handleBookClick(consultant)}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-blue-600 dark:hover:bg-blue-100 dark:hover:text-blue-900 font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg active:scale-95"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultants.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-user-slash text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No consultants found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try selecting a different category.</p>
        </div>
      )}

      {/* Booking Modal */}
      {selectedConsultant && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-gray-200 dark:border-gray-800">
            
            {/* Modal Header */}
            <div className="p-5 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-lg dark:text-white">
                {bookingStep === 'success' ? 'Booking Confirmed!' : `Book with ${selectedConsultant.name}`}
              </h3>
              <button onClick={closeBooking} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {bookingStep === 'date' && (
                <div className="space-y-5">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src={selectedConsultant.avatar} className="w-12 h-12 rounded-full" alt="" />
                    <div>
                      <p className="text-sm font-bold dark:text-white">{selectedConsultant.specialty}</p>
                      <p className="text-xs text-gray-500">${selectedConsultant.rate} / hour</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-lg p-3 text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'].map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 text-xs font-bold rounded-lg border ${
                            selectedTime === time 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setBookingStep('confirm')}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                  >
                    Continue
                  </button>
                </div>
              )}

              {bookingStep === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Consultant</span>
                      <span className="text-sm font-bold dark:text-white">{selectedConsultant.name}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Service</span>
                      <span className="text-sm font-bold dark:text-white">{selectedConsultant.specialty}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Date & Time</span>
                      <span className="text-sm font-bold dark:text-white">{selectedDate} @ {selectedTime}</span>
                    </div>
                    <div className="border-t border-blue-200 dark:border-blue-800 my-2 pt-2 flex justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">${selectedConsultant.rate}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    By clicking confirm, you agree to our cancellation policy.
                  </div>

                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setBookingStep('date')}
                      className="flex-1 py-3 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                    >
                      Back
                    </button>
                    <button 
                      onClick={confirmBooking}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 'success' && (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-blob">
                    <i className="fa-solid fa-check text-4xl text-green-600 dark:text-green-400"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Your session with <span className="font-bold">{selectedConsultant.name}</span> has been scheduled for {selectedDate} at {selectedTime}.
                  </p>
                  <button 
                    onClick={closeBooking}
                    className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetTheConsultant;
