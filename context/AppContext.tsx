
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Job, Notification, Message, User, Comment, ManagementProject } from '../types';
import { MOCK_POSTS, MOCK_JOBS, MOCK_USERS, MOCK_MANAGEMENT_PROJECTS } from '../constants';
import { api } from '../services/laravelApi';
import { useAuth } from './AuthContext';

interface AppContextType {
  posts: Post[];
  jobs: Job[];
  notifications: Notification[];
  messages: Message[];
  users: User[];
  projects: ManagementProject[];
  searchTerm: string;
  isDarkMode: boolean;
  setSearchTerm: (term: string) => void;
  toggleDarkMode: () => void;
  addPost: (post: Post) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
  applyForJob: (jobId: string, userId: string) => void;
  addJob: (job: Job) => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  toggleFollow: (currentUserId: string, targetUserId: string) => void;
  toggleConnect: (currentUserId: string, targetUserId: string) => void;
  updateUserProfile: (userId: string, data: Partial<User>) => void;
  addProject: (project: ManagementProject) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS as any);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Fix: Cast MOCK_USERS to any to avoid type conflict with UserRole enum
  const [users, setUsers] = useState<User[]>(MOCK_USERS as any);
  const [projects, setProjects] = useState<ManagementProject[]>(MOCK_MANAGEMENT_PROJECTS as any);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('hire_rig_theme');
    return saved === 'dark';
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      senderId: 'u2',
      receiverId: 'u1',
      content: "Hi Sarah! I saw your recent post about the design system. We're looking for someone with exactly those skills at FutureStack. Would you be open to a quick call?",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true
    }
  ]);

  // Initial Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // Only fetch if logged in
      
      try {
        // Parallel fetch for dashboard data
        const [postsRes, jobsRes, usersRes] = await Promise.allSettled([
          api.get('/posts'),
          api.get('/jobs'),
          api.get('/users')
        ]);

        if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value)) {
          setPosts(postsRes.value);
        }
        if (jobsRes.status === 'fulfilled' && Array.isArray(jobsRes.value)) {
          setJobs(jobsRes.value);
        }
        if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
          setUsers(usersRes.value);
          localStorage.setItem('hire_rig_all_users', JSON.stringify(usersRes.value));
        }

      } catch (error) {
        console.log("Using Mock Data (Backend unavailable)");
        // No action needed, initial state is already set to MOCK data
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hire_rig_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // --- Actions (with Optimistic UI Updates + API Calls) ---

  const addPost = async (post: Post) => {
    setPosts([post, ...posts]); // Optimistic update
    try {
      await api.post('/posts', post);
    } catch (e) { console.error("API Error: Failed to create post"); }
  };

  const likePost = async (postId: string, userId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const liked = p.likes.includes(userId);
        return {
          ...p,
          likes: liked ? p.likes.filter(id => id !== userId) : [...p.likes, userId]
        };
      }
      return p;
    }));
    try {
      await api.post(`/posts/${postId}/like`, { userId });
    } catch (e) { console.error("API Error: Failed to like post"); }
  };

  const addComment = async (postId: string, comment: Comment) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, comment] };
      }
      return p;
    }));
    try {
      await api.post(`/posts/${postId}/comment`, comment);
    } catch (e) { console.error("API Error: Failed to comment"); }
  };

  const addJob = async (job: Job) => {
    setJobs([job, ...jobs]);
    try {
      await api.post('/jobs', job);
    } catch (e) { console.error("API Error: Failed to add job"); }
  };

  const applyForJob = async (jobId: string, userId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId && !j.applicants.includes(userId)) {
        return { ...j, applicants: [...j.applicants, userId] };
      }
      return j;
    }));
    try {
      await api.post(`/jobs/${jobId}/apply`, { userId });
    } catch (e) { console.error("API Error: Failed to apply"); }
  };

  const sendMessage = async (senderId: string, receiverId: string, content: string) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMessage]);
    try {
      await api.post('/messages', newMessage);
    } catch (e) { console.error("API Error: Failed to send message"); }
  };

  const toggleFollow = async (currentUserId: string, targetUserId: string) => {
    // Logic for optimistic local update
    const newUsers = users.map(u => {
      if (u.id === currentUserId) {
        const isFollowing = u.following.includes(targetUserId);
        return { ...u, following: isFollowing ? u.following.filter(id => id !== targetUserId) : [...u.following, targetUserId] };
      }
      if (u.id === targetUserId) {
        const isFollowedBy = u.followers?.includes(currentUserId);
        return { ...u, followers: isFollowedBy ? u.followers.filter(id => id !== currentUserId) : [...(u.followers || []), currentUserId] };
      }
      return u;
    });
    setUsers(newUsers);
    localStorage.setItem('hire_rig_all_users', JSON.stringify(newUsers));
    
    try {
      await api.post(`/users/${targetUserId}/follow`, { followerId: currentUserId });
    } catch (e) { console.error("API Error: Failed to follow"); }
  };

  const toggleConnect = async (currentUserId: string, targetUserId: string) => {
     // Logic for optimistic local update
    const newUsers = users.map(u => {
      if (u.id === currentUserId) {
        const isConnected = u.connections.includes(targetUserId);
        return { ...u, connections: isConnected ? u.connections.filter(id => id !== targetUserId) : [...u.connections, targetUserId] };
      }
      if (u.id === targetUserId) {
        const isConnected = u.connections.includes(currentUserId);
        return { ...u, connections: isConnected ? u.connections.filter(id => id !== currentUserId) : [...u.connections, currentUserId] };
      }
      return u;
    });
    setUsers(newUsers);
    localStorage.setItem('hire_rig_all_users', JSON.stringify(newUsers));

    try {
      await api.post(`/users/${targetUserId}/connect`, { requesterId: currentUserId });
    } catch (e) { console.error("API Error: Failed to connect"); }
  };

  const updateUserProfile = async (userId: string, data: Partial<User>) => {
    const newUsers = users.map(u => u.id === userId ? { ...u, ...data } : u);
    setUsers(newUsers);
    localStorage.setItem('hire_rig_all_users', JSON.stringify(newUsers));
    // AuthContext handles the user/me update, but this updates the public list view if necessary
  };

  const addProject = async (project: ManagementProject) => {
    setProjects([project, ...projects]);
    // Future API hook: await api.post('/projects', project);
  };

  return (
    <AppContext.Provider value={{ 
      posts, jobs, notifications, messages, users, projects, searchTerm, isDarkMode, 
      setSearchTerm, toggleDarkMode, addPost, likePost, addComment, applyForJob, 
      addJob, sendMessage, toggleFollow, toggleConnect, updateUserProfile, addProject
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
