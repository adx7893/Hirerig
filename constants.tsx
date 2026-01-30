
export const APP_NAME = "HireRig";

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Sarah Connor',
    email: 'sarah@candidate.com',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop',
    headline: 'Senior Full Stack Developer | React & Node.js Expert',
    bio: 'Passionate about building scalable web applications and mentoring junior developers. Specialized in modern JavaScript ecosystems.',
    connections: ['u2', 'u3', 'u4'],
    following: ['u2'],
    followers: ['u2', 'u5'],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e1',
        title: 'Senior Engineer',
        company: 'Tech Solutions Inc.',
        location: 'Remote',
        startDate: '2021-01',
        description: 'Leading the frontend team in developing high-performance dashboards.'
      }
    ]
  },
  {
    id: 'u2',
    name: 'James Rodriguez',
    email: 'james@recruiter.com',
    role: 'RECRUITER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop',
    headline: 'Technical Recruiter @ FutureStack | Hiring Top Talent',
    bio: 'Helping developers find their dream roles in the tech industry.',
    connections: ['u1', 'u3'],
    following: ['u1'],
    followers: ['u1'],
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'michael@candidate.com',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    headline: 'UX/UI Designer | Creating Human-Centered Digital Experiences',
    bio: 'Award-winning designer with a knack for simplifying complex workflows. Expert in Figma and Design Systems.',
    connections: ['u1', 'u2'],
    following: [],
    followers: ['u1'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Adobe XD', 'HTML/CSS'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e2',
        title: 'Product Designer',
        company: 'Creative Studio',
        location: 'San Francisco, CA',
        startDate: '2020-05',
        endDate: '2023-08',
        description: 'Redesigned the core mobile application resulting in a 40% increase in user retention.'
      }
    ]
  },
  {
    id: 'u4',
    name: 'Emily Davis',
    email: 'emily@candidate.com',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    headline: 'DevOps Engineer | Cloud Infrastructure & CI/CD Automation',
    bio: 'Automating everything I can. Focused on reliability, scalability, and security in cloud environments.',
    connections: ['u1'],
    following: ['u1'],
    followers: [],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Python', 'Jenkins'],
    isLookingForJob: false,
    experience: [
      {
        id: 'e3',
        title: 'DevOps Lead',
        company: 'CloudNet Systems',
        location: 'Austin, TX',
        startDate: '2019-11',
        description: 'Managing a multi-region cloud infrastructure for high-traffic applications.'
      }
    ]
  },
  {
    id: 'u5',
    name: 'David Kim',
    email: 'david@candidate.com',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    headline: 'Product Manager | MBA | Strategy & Execution',
    bio: 'Bridging the gap between business requirements and technical implementation. Data-driven decision maker.',
    connections: ['u1'],
    following: [],
    followers: ['u1'],
    skills: ['Product Strategy', 'Agile', 'JIRA', 'SQL', 'Market Analysis'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e4',
        title: 'Senior PM',
        company: 'FinTech Corp',
        location: 'New York, NY',
        startDate: '2021-03',
        description: 'Launched 3 successful B2B products generating $5M in ARR.'
      }
    ]
  },
  {
    id: 'u6',
    name: 'Lisa Wang',
    email: 'lisa@candidate.com',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    headline: 'Data Scientist | Machine Learning & AI Enthusiast',
    bio: 'Turning raw data into actionable insights. passionate about NLP and Computer Vision.',
    connections: [],
    following: [],
    followers: [],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e5',
        title: 'Data Analyst',
        company: 'Retail Giants',
        location: 'Chicago, IL',
        startDate: '2020-06',
        endDate: '2022-12',
        description: 'Built predictive models for inventory management.'
      }
    ]
  }
];

export const MOCK_POSTS = [
  {
    id: 'p1',
    authorId: 'u1',
    authorName: 'Sarah Connor',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    authorHeadline: 'Senior Full Stack Developer',
    content: "Just finished building a new design system using Tailwind and Headless UI. The developer experience is incredible! #React #Frontend #DesignSystem",
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    likes: ['u2', 'u3'],
    comments: [],
    timestamp: new Date().toISOString()
  },
  {
    id: 'p2',
    authorId: 'u2',
    authorName: 'James Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    authorHeadline: 'Technical Recruiter @ FutureStack',
    content: "We are actively hiring Senior Backend Engineers! If you love Go and Distributed Systems, DM me or check our careers page. 🚀",
    likes: ['u4'],
    comments: [],
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'p3',
    authorId: 'u3',
    authorName: 'Michael Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    authorHeadline: 'UX/UI Designer',
    content: "Big news! I just published my case study on simplifying checkout flows. Check it out on my portfolio. Feedback welcome! 🎨 #UXDesign #CaseStudy",
    likes: ['u1', 'u5'],
    comments: [],
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];

export const MOCK_JOBS = [
  {
    id: 'j1',
    title: 'Senior React Developer',
    company: 'InnovateX',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$150k - $180k',
    description: 'We are looking for a React expert to help us build the future of AI-driven analytics.',
    requirements: ['5+ years React', 'Strong TypeScript', 'Experience with GraphQL'],
    postedBy: 'u2',
    applicants: [],
    postedDate: '2023-10-01',
    status: 'Open'
  },
  {
    id: 'j2',
    title: 'Product Designer',
    company: 'DesignFlow',
    location: 'New York, NY',
    type: 'Remote',
    salary: '$120k - $150k',
    description: 'Lead our UI/UX efforts for our mobile and web platforms.',
    requirements: ['Figma', 'User Research', 'Design Systems'],
    postedBy: 'u2',
    applicants: ['u1', 'u3'],
    postedDate: '2023-10-05',
    status: 'Open'
  },
  {
    id: 'j3',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    type: 'Contract',
    salary: '$90 - $120 / hr',
    description: 'Looking for a Kubernetes expert to migrate our legacy infrastructure.',
    requirements: ['AWS', 'Terraform', 'Kubernetes'],
    postedBy: 'u2',
    applicants: ['u4'],
    postedDate: '2023-10-06',
    status: 'Open'
  }
];

export const MOCK_MANAGEMENT_PROJECTS = [
  {
    id: 'pr1',
    title: 'E-Commerce Platform Redesign',
    client: 'RetailGiant Corp',
    description: 'Complete overhaul of the legacy monolithic e-commerce system to a microservices architecture using Node.js and React.',
    status: 'In Progress',
    deadline: '2024-12-15',
    techStack: ['React', 'Node.js', 'AWS', 'MongoDB'],
    team: ['u1', 'u3'],
    progress: 65,
    budget: '$120,000'
  },
  {
    id: 'pr2',
    title: 'AI Customer Support Bot',
    client: 'FinTech Solutions',
    description: 'Implementing a conversational AI bot using Gemini API to handle level 1 customer support queries automatically.',
    status: 'Planning',
    deadline: '2025-02-28',
    techStack: ['Python', 'TensorFlow', 'Gemini API', 'FastAPI'],
    team: ['u6'],
    progress: 10,
    budget: '$45,000'
  },
  {
    id: 'pr3',
    title: 'Internal HR Dashboard',
    client: 'Global Logistics',
    description: 'A centralized dashboard for HR to manage employee leaves, performance reviews, and payroll integration.',
    status: 'Completed',
    deadline: '2023-11-30',
    techStack: ['Vue.js', 'Laravel', 'MySQL'],
    team: ['u1', 'u4', 'u5'],
    progress: 100,
    budget: '$85,000'
  }
];
