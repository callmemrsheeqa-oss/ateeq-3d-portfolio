export interface SocialLink {
  id: 'github' | 'linkedin' | 'instagram' | 'facebook' | 'email';
  label: string;
  handle: string;
  href: string;
  description: string;
  external: boolean;
}

export interface TimelineItem {
  id: string;
  index: string;
  category: string;
  title: string;
  organization: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  takeaway: string;
}

export interface SkillGroup {
  id: string;
  index: string;
  symbol: string;
  domain: string;
  title: string;
  description: string;
  topics: string[];
  contextLabel: string;
}

export const PROFILE = {
  name: 'Ateeq Ur Rehman',
  initials: 'AR',
  tagline: 'A mathematical mind exploring artificial intelligence and creative software.',
  rotatingRoles: [
    'Mathematics Student',
    'AI & Machine Learning Enthusiast',
    'Creative Developer',
    'Technology Explorer',
  ],
  location: 'Multan, Pakistan',
  coordinates: '30° 11′ N · 71° 28′ E',
  email: 'sunbulbroter@gmail.com',
  avatarPath: '/images/profile.jpg',
  education: {
    degree: 'Bachelor of Science (BS) in Mathematics',
    semester: '7th Semester',
    period: '2023 – 2027',
    department: 'College of Arts and Sciences in Pure and Applied Mathematics (CASPAM)',
    university: 'Bahauddin Zakariya University (BZU), Multan',
    focus: 'Pure & applied mathematical foundations, abstract algebra, logical reasoning, and quantitative modeling.',
    previousNote:
      'Earlier academic qualifications (school/college details and grades) can be added directly in src/data/profile.ts without altering page layout.',
  },
  philosophyQuote:
    'I value steady progress: ask better questions, build small experiments, learn from what does not work, and improve the next version.',
  aboutStory: [
    'Studying mathematics at CASPAM has trained me to look for underlying structure, question assumptions, and move through complex problems step by step. I enjoy bridging the gap between an abstract theorem and a working digital tool.',
    'Alongside my BS Mathematics degree, I explore Python, machine learning fundamentals, modern web engineering, and AI-assisted development—turning curiosity into interactive software and practical experiments.',
    'Teaching mathematics for two years has also shaped how I design and explain technical systems: clarity begins by understanding where the learner or user stands, then building the next logical step with them.',
  ],
  principles: [
    {
      index: '01',
      title: 'Explain clearly',
      body: 'Make the next step understandable, not merely technically correct.',
    },
    {
      index: '02',
      title: 'Stay curious',
      body: 'Ask sharper questions, test assumptions, and iterate openly on feedback.',
    },
    {
      index: '03',
      title: 'Build with integrity',
      body: 'Present work honestly—distinguishing finished builds from active explorations and concepts.',
    },
  ],
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'email',
    label: 'Email',
    handle: 'sunbulbroter@gmail.com',
    href: 'mailto:sunbulbroter@gmail.com',
    description: 'Direct email correspondence',
    external: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    handle: 'github.com/callmemrsheeqa-oss',
    href: 'https://github.com/callmemrsheeqa-oss',
    description: 'Repositories, prototypes, and source code',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'linkedin.com/in/ateeq-sunbul-95694729a',
    href: 'https://linkedin.com/in/ateeq-sunbul-95694729a/',
    description: 'Academic and professional profile',
    external: true,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    handle: '@a_teequrrehman',
    href: 'https://instagram.com/a_teequrrehman/',
    description: 'Personal updates and creative moments',
    external: true,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    handle: 'Ateeq Ur Rehman',
    href: 'https://facebook.com/ateeq.ur.rehman.856079',
    description: 'Community connections',
    external: true,
  },
];

export const EXPERIENCE_TIMELINE: TimelineItem[] = [
  {
    id: 'zgdc',
    index: '01',
    category: 'Student Leadership',
    title: 'Vice President',
    organization: 'Zakariyan Google Developer Club (ZGDC)',
    period: 'October 2026 – June 2027',
    location: 'BZU, Multan',
    summary:
      'Serving as Vice President of the Zakariyan Google Developer Club, supporting student leadership, technology-focused initiatives, and peer learning across the campus developer community.',
    highlights: ['Technical Community', 'Event Leadership', 'Peer Collaboration'],
    takeaway: 'Strong developer communities grow when curious students share tools, questions, and real builds openly.',
  },
  {
    id: 'teaching',
    index: '02',
    category: 'Mathematics Instruction',
    title: 'Mathematics Teacher',
    organization: 'Class 1 through Class 12 Tutoring',
    period: 'Approx. 2 Years',
    location: 'Multan, Pakistan',
    summary:
      'Teaching mathematics across foundational school and higher-secondary levels, strengthening the ability to decompose multi-step derivations and adapt explanations to each student.',
    highlights: ['Concept Clarity', 'Stepwise Proofs', 'Adaptive Pedagogy'],
    takeaway: 'Understanding a concept becomes natural when the explanation meets the learner where they are.',
  },
  {
    id: 'zds',
    index: '03',
    category: 'Student Society',
    title: 'Executive Member',
    organization: 'Zakarian Debating Society (ZDS)',
    period: 'University Term',
    location: 'BZU, Multan',
    summary:
      'Contributing as an executive member in a university debating community centered on structured argumentation, public speaking, and thoughtful teamwork.',
    highlights: ['Public Communication', 'Structured Reasoning', 'Team Coordination'],
    takeaway: 'Clear articulation requires listening carefully before formulating a response.',
  },
  {
    id: 'mcb',
    index: '04',
    category: 'Industry Exposure',
    title: 'Banking Intern',
    organization: 'MCB Bank (Chungi No. 6 Branch)',
    period: 'Arranged via BZU CDC',
    location: 'Multan, Pakistan',
    summary:
      'Completed an internship arranged through the BZU Career Development Center at MCB Bank, gaining firsthand exposure to branch operations and professional service workflows.',
    highlights: ['Operational Workflows', 'Client Service', 'Applied Discipline'],
    takeaway: 'Real-world systems depend on accuracy, reliability, and clear communication under routine pressure.',
  },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'mathematics',
    index: '01',
    symbol: '∑',
    domain: 'Core Discipline',
    title: 'Mathematical Reasoning',
    description:
      'Analytical habits cultivated through BS Mathematics at CASPAM: formal logic, abstract algebra, pattern recognition, and rigorous verification.',
    topics: ['Abstract Algebra', 'Linear Algebra', 'Calculus & Analysis', 'Logical Proof'],
    contextLabel: 'Academic Foundation',
  },
  {
    id: 'aiml',
    index: '02',
    symbol: '∇',
    domain: 'Intelligence Systems',
    title: 'AI & Machine Learning',
    description:
      'Exploring supervised prediction, retrieval-augmented generation (RAG), and LLM-assisted workflows grounded in mathematical intuition.',
    topics: ['Predictive Modeling', 'RAG Workflows', 'LLM Integration', 'Evaluation Basics'],
    contextLabel: 'Applied Exploration',
  },
  {
    id: 'python',
    index: '03',
    symbol: 'λ',
    domain: 'Computation',
    title: 'Python & Scientific Tooling',
    description:
      'Using Python for symbolic mathematics, data transformation, numerical prototyping, and local Flask/Streamlit applications.',
    topics: ['Python', 'SymPy & NumPy', 'Pandas & Matplotlib', 'Flask & Streamlit'],
    contextLabel: 'Active Practice',
  },
  {
    id: 'web',
    index: '04',
    symbol: '∂',
    domain: 'Interactive Systems',
    title: 'Web Engineering & 3D UI',
    description:
      'Building responsive, accessible interfaces with semantic HTML, modern CSS, TypeScript, React, Three.js, and Node.js APIs.',
    topics: ['React & TypeScript', 'Tailwind CSS', 'Three.js / R3F', 'Express APIs'],
    contextLabel: 'Continuous Building',
  },
  {
    id: 'ai-assisted',
    index: '05',
    symbol: '∞',
    domain: 'Workflow',
    title: 'AI-Assisted Engineering',
    description:
      'Leveraging modern AI coding tools thoughtfully to accelerate prototyping, inspect unfamiliar APIs, and refine architecture while verifying fundamentals.',
    topics: ['Rapid Prototyping', 'Code Auditing', 'Prompt Design', 'Iterative Debugging'],
    contextLabel: 'Practical Workflow',
  },
  {
    id: 'communication',
    index: '06',
    symbol: 'π',
    domain: 'Leadership',
    title: 'Teaching & Collaboration',
    description:
      'Translating technical and mathematical concepts across diverse audiences through two years of teaching and university society leadership.',
    topics: ['Mathematics Tutoring', 'Debate & Rhetoric', 'Club Leadership', 'Technical Writing'],
    contextLabel: 'Practised Through Experience',
  },
];
