
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoggingIn(true);
      await login(email, role);
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    await login('google-user@example.com', UserRole.CANDIDATE);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center pt-4 transition-colors duration-300 relative overflow-hidden">
      
      {/* Animated Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-600/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob delay-4000"></div>
      </div>

      <div className="w-full max-w-md px-6 z-10">
        <div className="flex items-center justify-center mb-10 opacity-0 animate-fade-up">
          <div className="text-blue-600 dark:text-blue-500 font-black text-4xl flex items-center tracking-tight">
            <i className="fa-solid fa-briefcase mr-3 text-3xl"></i> HireRig
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white dark:border-gray-800 transition-all opacity-0 animate-fade-up delay-100">
          <div className="opacity-0 animate-fade-up delay-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join HireRig'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
              {isLogin ? 'Stay updated on your professional world.' : 'Make the most of your professional life.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="opacity-0 animate-fade-up delay-300">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
                />
              </div>
            )}
            <div className="opacity-0 animate-fade-up delay-300">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
            </div>
            
            <div className="opacity-0 animate-fade-up delay-400">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2.5">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.CANDIDATE)}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center space-x-2 ${role === UserRole.CANDIDATE ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.05] ring-4 ring-blue-600/10' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <i className="fa-solid fa-user-graduate"></i>
                  <span>Candidate</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setRole(UserRole.RECRUITER)}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center space-x-2 ${role === UserRole.RECRUITER ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.05] ring-4 ring-blue-600/10' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <i className="fa-solid fa-user-tie"></i>
                  <span>Recruiter</span>
                </button>
              </div>
            </div>

            <div className="opacity-0 animate-fade-up delay-500 pt-2">
              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="group relative w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all text-lg shadow-xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {isLoggingIn ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : null}
                  {isLogin ? 'Sign In' : 'Agree & Join'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center space-x-3 opacity-0 animate-fade-up delay-500">
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
          </div>

          <div className="opacity-0 animate-fade-up delay-500">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5 mr-3" alt="Google" />
              Continue with Google
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm opacity-0 animate-fade-up delay-500">
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {isLogin ? "New to HireRig? " : "Already on HireRig? "}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1 transition-colors"
            >
              {isLogin ? 'Join now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;