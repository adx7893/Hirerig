
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: UserRole;
  avatar: string;
  banner?: string;
  headline: string;
  bio?: string; // This acts as 'Summary'
  experience?: Experience[];
  education?: Education[];
  skills?: string[]; // Kept for backward compatibility, represents all skills
  softSkills?: string[];
  technicalSkills?: string[];
  projects?: Project[];
  languages?: string[];
  connections: string[]; // IDs
  following: string[]; // IDs
  followers: string[]; // IDs
  isHiring?: boolean;
  isLookingForJob?: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  startDate: string;
  endDate?: string;
}

// New Interface for Project Management Module
export interface ManagementProject {
  id: string;
  title: string;
  client: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  deadline: string;
  techStack: string[];
  team: string[]; // User IDs of candidates
  progress: number; // 0-100
  budget?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  content: string;
  image?: string;
  likes: string[]; // user IDs
  comments: Comment[];
  timestamp: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract';
  salary?: string;
  description: string;
  requirements: string[];
  postedBy: string; // Recruiter ID
  applicants: string[]; // Candidate IDs
  postedDate: string;
  status: 'Open' | 'Closed';
  
  // New detailed fields
  schedule?: string;
  isRemote?: boolean;
  address?: {
    street: string;
    city: string;
    province: string;
    country: string;
  };
  benefits?: string[];
  compensation?: {
    min: string;
    max: string;
    currency: string;
    frequency: string;
  };
  companyPitch?: string;
  companyDescription?: string;
  resumeRequired?: boolean;
  notificationEmails?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'LIKE' | 'COMMENT' | 'CONNECTION_REQUEST' | 'JOB_ALERT' | 'MESSAGE';
  content: string;
  fromId?: string;
  read: boolean;
  timestamp: string;
}
