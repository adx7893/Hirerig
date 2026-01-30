
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Messaging from './pages/Messaging';
import Profile from './pages/Profile';
import Candidates from './pages/Candidates';
import ProjectManagement from './pages/ProjectManagement';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600"></i></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  const isRecruiter = user?.role === UserRole.RECRUITER;
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isRecruiter ? 'bg-gray-50 dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-950'}`}>
      <Navbar />
      <div className={isRecruiter ? 'ml-64 p-8 min-h-screen' : 'bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-56px)]'}>
        {children}
      </div>
    </div>
  );
};

// Placeholder component for new Recruiter Routes
const RecruiterPlaceholder: React.FC<{ title: string }> = ({ title }) => (
  <div className="max-w-6xl mx-auto p-10 text-center dark:text-white animate-fade-up">
    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <i className="fa-solid fa-person-digging text-3xl text-blue-600"></i>
    </div>
    <h1 className="text-3xl font-bold mb-2">{title}</h1>
    <p className="text-gray-500 dark:text-gray-400">This module is currently under development.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/profile/:userId" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/messaging" element={
              <ProtectedRoute>
                <Messaging />
              </ProtectedRoute>
            } />
            
            {/* Recruiter Routes */}
            <Route path="/candidates" element={
              <ProtectedRoute>
                <Candidates />
              </ProtectedRoute>
            } />
            
            {/* Integrated Project Management Routes */}
            <Route path="/project" element={
              <ProtectedRoute>
                <ProjectManagement />
              </ProtectedRoute>
            } />
            <Route path="/generate-project" element={
              <ProtectedRoute>
                <ProjectManagement openCreate={true} />
              </ProtectedRoute>
            } />

            <Route path="/consultant" element={<ProtectedRoute><RecruiterPlaceholder title="Meet the Consultant" /></ProtectedRoute>} />
            <Route path="/submitted" element={<ProtectedRoute><RecruiterPlaceholder title="Submitted Applications" /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><RecruiterPlaceholder title="Application Management" /></ProtectedRoute>} />
            <Route path="/enrollment" element={<ProtectedRoute><RecruiterPlaceholder title="New Enrollment" /></ProtectedRoute>} />
            <Route path="/registration" element={<ProtectedRoute><RecruiterPlaceholder title="Registration" /></ProtectedRoute>} />
            <Route path="/placements" element={<ProtectedRoute><RecruiterPlaceholder title="Placements" /></ProtectedRoute>} />
            <Route path="/subscribers" element={<ProtectedRoute><RecruiterPlaceholder title="Subscribers" /></ProtectedRoute>} />
            <Route path="/post-job" element={<ProtectedRoute><RecruiterPlaceholder title="Post a Job" /></ProtectedRoute>} />
            <Route path="/roles" element={<ProtectedRoute><RecruiterPlaceholder title="Role Management" /></ProtectedRoute>} />
            <Route path="/batches" element={<ProtectedRoute><RecruiterPlaceholder title="Batch Management" /></ProtectedRoute>} />
            <Route path="/promotions" element={<ProtectedRoute><RecruiterPlaceholder title="Promotions" /></ProtectedRoute>} />

            <Route path="/notifications" element={
              <ProtectedRoute>
                <div className="max-w-6xl mx-auto p-10 text-center dark:text-white">
                  <h1 className="text-4xl font-bold">Notifications</h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-4 underline">All caught up!</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
