
export const APP_NAME = "HireRig";

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Sarah Connor',
    email: 'sarah@candidate.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop',
    headline: 'Senior Full Stack Developer | React & Node.js Expert',
    bio: 'Passionate Senior Full Stack Developer with over 5 years of experience building scalable web applications. Adept at leading frontend teams and mentoring junior developers. Specialized in the modern JavaScript ecosystem, delivering high-performance solutions for complex business needs.',
    connections: ['u2', 'u3', 'u4'],
    following: ['u2'],
    followers: ['u2', 'u5'],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
    technicalSkills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL'],
    softSkills: ['Leadership', 'Mentoring', 'Communication', 'Problem Solving', 'Agile Methodology'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e1',
        title: 'Senior Engineer',
        company: 'Tech Solutions Inc.',
        location: 'Remote',
        startDate: '2021-01',
        description: 'Leading the frontend team in developing high-performance dashboards. Improved application load time by 40% through code splitting and optimization. Mentored 3 junior developers to promotion.'
      }
    ],
    education: [
      {
        id: 'ed1',
        school: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2015-09',
        endDate: '2019-05'
      }
    ]
  },
  {
    id: 'u2',
    name: 'Bhargav Desai',
    email: 'bhargav.desai@sapsol.com',
    phone: '+1 (555) 987-6543',
    location: 'Toronto, ON',
    role: 'RECRUITER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1000&auto=format&fit=crop',
    headline: 'Talent Acquisition @ Sapsol',
    bio: 'Helping developers find their dream roles in the tech industry. Focused on building long-term relationships with candidates and clients.',
    connections: ['u1', 'u3'],
    following: ['u1'],
    followers: ['u1'],
  },
  {
    id: 'u3',
    name: 'Michael Chen',
    email: 'michael@candidate.com',
    phone: '+1 (555) 555-5555',
    location: 'Austin, TX',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    headline: 'UX/UI Designer | Creating Human-Centered Digital Experiences',
    bio: 'Award-winning designer with a knack for simplifying complex workflows. Expert in Figma and Design Systems. Committed to user-centric design principles.',
    connections: ['u1', 'u2'],
    following: [],
    followers: ['u1'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Adobe XD', 'HTML/CSS'],
    technicalSkills: ['Figma', 'Adobe XD', 'Sketch', 'HTML', 'CSS', 'Principle'],
    softSkills: ['Empathy', 'Collaboration', 'User Research', 'Presentation'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e2',
        title: 'Product Designer',
        company: 'Creative Studio',
        location: 'San Francisco, CA',
        startDate: '2020-05',
        endDate: '2023-08',
        description: 'Redesigned the core mobile application resulting in a 40% increase in user retention. Conducted user research studies to inform product roadmap.'
      }
    ]
  },
  {
    id: 'u4',
    name: 'Emily Davis',
    email: 'emily@candidate.com',
    phone: '+1 (555) 222-3333',
    location: 'Seattle, WA',
    role: 'CANDIDATE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    headline: 'DevOps Engineer | Cloud Infrastructure & CI/CD Automation',
    bio: 'Automating everything I can. Focused on reliability, scalability, and security in cloud environments.',
    connections: ['u1'],
    following: ['u1'],
    followers: [],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Python', 'Jenkins'],
    technicalSkills: ['Kubernetes', 'Terraform', 'AWS', 'Python', 'Bash', 'Jenkins', 'Docker'],
    softSkills: ['Problem Solving', 'Incident Management', 'Communication'],
    isLookingForJob: false,
    experience: [
      {
        id: 'e3',
        title: 'DevOps Lead',
        company: 'CloudNet Systems',
        location: 'Austin, TX',
        startDate: '2019-11',
        description: 'Managing a multi-region cloud infrastructure for high-traffic applications. Implemented IAC using Terraform.'
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
    technicalSkills: ['JIRA', 'SQL', 'Tableau', 'Google Analytics'],
    softSkills: ['Leadership', 'Strategic Thinking', 'Stakeholder Management'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e4',
        title: 'Senior PM',
        company: 'FinTech Corp',
        location: 'New York, NY',
        startDate: '2021-03',
        description: 'Launched 3 successful B2B products generating $5M in ARR. Led a cross-functional team of 10.'
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
    bio: 'Turning raw data into actionable insights. Passionate about NLP and Computer Vision.',
    connections: [],
    following: [],
    followers: [],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau'],
    technicalSkills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Scikit-learn'],
    softSkills: ['Analytical Thinking', 'Communication', 'Curiosity'],
    isLookingForJob: true,
    experience: [
      {
        id: 'e5',
        title: 'Data Analyst',
        company: 'Retail Giants',
        location: 'Chicago, IL',
        startDate: '2020-06',
        endDate: '2022-12',
        description: 'Built predictive models for inventory management resulting in 15% cost reduction.'
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
    authorName: 'Bhargav Desai',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    authorHeadline: 'Talent Acquisition @ Sapsol',
    content: "We are actively hiring Senior Backend Engineers! If you love Go and Distributed Systems, DM me or check our careers page. 🚀",
    likes: ['u4'],
    comments: [],
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

export const MOCK_JOBS = [
  {
    id: 'j1',
    title: 'Retail Inventory & Planning Systems Integration Consultant',
    company: 'Sapsol',
    location: 'Canada',
    type: 'Contract',
    salary: 'Competitve',
    description: 'Specialized consultant needed for retail planning systems.',
    requirements: ['Retail Systems', 'Integration', 'Planning'],
    postedBy: 'u2', // Bhargav
    applicants: ['u1', 'u3', 'u4'],
    postedDate: '2025-07-23 10:44:00',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '6 months ago',
    status: 'Active'
  },
  {
    id: 'j2',
    title: 'POst Partner',
    company: 'Sapsol',
    location: 'Mississauga, Ontario, Canada',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Partner role for ongoing operations.',
    requirements: ['Partnership', 'Business Development'],
    postedBy: 'u2',
    applicants: ['u3', 'u5', 'u6'],
    postedDate: '2025-03-07 12:53:11',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '10 months ago',
    status: 'Active'
  },
  {
    id: 'j3',
    title: 'WEB APPLICATION',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Web application development role.',
    requirements: ['Web Dev', 'HTML', 'CSS'],
    postedBy: 'u2',
    applicants: [],
    postedDate: '2025-01-09 08:44:07',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j4',
    title: 'data',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Data entry and processing.',
    requirements: ['Excel', 'Data Entry'],
    postedBy: 'u2',
    applicants: ['u6', 'u1'],
    postedDate: '2024-10-02 12:03:07',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j5',
    title: 'developers',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'General developer role.',
    requirements: ['Coding', 'Debugging'],
    postedBy: 'u2',
    applicants: ['u1', 'u4', 'u6', 'u3'],
    postedDate: '2024-09-20 10:30:39',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j6',
    title: 'Excel',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Part-time',
    salary: 'TBD',
    description: 'Advanced Excel tasks.',
    requirements: ['Excel', 'Macros'],
    postedBy: 'u2',
    applicants: ['u5'],
    postedDate: '2024-07-15 11:03:44',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j7',
    title: 'c',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'C programming.',
    requirements: ['C', 'Embedded'],
    postedBy: 'u2',
    applicants: ['u4', 'u1'],
    postedDate: '2023-12-15 11:09:47',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '2 years ago',
    status: 'Active'
  },
  {
    id: 'j8',
    title: 'developer',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Software developer.',
    requirements: ['Software Development'],
    postedBy: 'u2',
    applicants: ['u1', 'u3', 'u4'],
    postedDate: '2024-05-24 11:15:18',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j9',
    title: 'java',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Java backend development.',
    requirements: ['Java', 'Spring'],
    postedBy: 'u2',
    applicants: ['u1', 'u4'],
    postedDate: '2023-10-20 14:39:54',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '2 years ago',
    status: 'Active'
  },
  {
    id: 'j10',
    title: 'automation testing',
    company: 'Sapsol',
    location: 'Surat, Gujarat, India',
    type: 'Full-time',
    salary: 'TBD',
    description: 'QA Automation.',
    requirements: ['Selenium', 'Java'],
    postedBy: 'u2',
    applicants: ['u4'],
    postedDate: '2024-03-21 10:27:49',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '1 year ago',
    status: 'Active'
  },
  {
    id: 'j11',
    title: 'PHP Laravel Dev',
    company: 'Test Company',
    location: 'Mississauga, Ontario, Canada',
    type: 'Full-time',
    salary: 'TBD',
    description: 'Laravel development.',
    requirements: ['PHP', 'Laravel'],
    postedBy: 'u2',
    applicants: [],
    postedDate: '2023-12-20 11:48:04',
    creatorEmail: 'bhargav.desai@sapsol.com',
    timeAgo: '2 years ago',
    status: 'Active'
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
