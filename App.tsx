
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
import MeetTheConsultant from './pages/MeetTheConsultant';
import SubmittedApplications from './pages/SubmittedApplications';
import ApplicationManagement from './pages/ApplicationManagement';
import NewEnrollment from './pages/NewEnrollment';
import Registration from './pages/Registration';
import Placements from './pages/Placements';
import Subscribers from './pages/Subscribers';
import PostJob from './pages/PostJob';
import RoleManagement from './pages/RoleManagement';
import BatchManagement from './pages/BatchManagement';
import Promotions from './pages/Promotions';
import CareerAgent from './pages/CareerAgent';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900"><i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600"></i></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  const isRecruiter = user?.role === UserRole.RECRUITER;
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${isRecruiter ? 'bg-gray-50 dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-950'}`}>
      <Navbar />
      <div className={isRecruiter ? 'md:ml-64 p-4 md:p-8 min-h-screen pt-20 md:pt-8' : 'bg-gray-50 dark:bg-gray-950 min-h-[calc(100vh-56px)]'}>
        {children}
      </div>
    </div>
  );
};

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

            {/* Functional Routes */}
            <Route path="/consultant" element={
              <ProtectedRoute>
                <MeetTheConsultant />
              </ProtectedRoute>
            } />
            <Route path="/submitted" element={
              <ProtectedRoute>
                <SubmittedApplications />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <ApplicationManagement />
              </ProtectedRoute>
            } />
            <Route path="/enrollment" element={
              <ProtectedRoute>
                <NewEnrollment />
              </ProtectedRoute>
            } />
            <Route path="/registration" element={
              <ProtectedRoute>
                <Registration />
              </ProtectedRoute>
            } />
            <Route path="/placements" element={
              <ProtectedRoute>
                <Placements />
              </ProtectedRoute>
            } />

            {/* Newly Added Data Management Routes */}
            <Route path="/subscribers" element={
              <ProtectedRoute>
                <Subscribers />
              </ProtectedRoute>
            } />
            <Route path="/post-job" element={
              <ProtectedRoute>
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/roles" element={
              <ProtectedRoute>
                <RoleManagement />
              </ProtectedRoute>
            } />
            <Route path="/batches" element={
              <ProtectedRoute>
                <BatchManagement />
              </ProtectedRoute>
            } />
            <Route path="/promotions" element={
              <ProtectedRoute>
                <Promotions />
              </ProtectedRoute>
            } />
            
            {/* AI Career Agent */}
            <Route path="/career-agent" element={
              <ProtectedRoute>
                <CareerAgent />
              </ProtectedRoute>
            } />

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
