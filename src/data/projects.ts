export type ProjectCategory = 'Mathematics' | 'AI & ML' | 'Web & Apps' | 'Concepts';

export type ProjectStatus = 'Built' | 'Built · Local' | 'In Progress' | 'Exploration' | 'Concept';

export type ProjectGeometryMotif =
  | 'group-symmetry'
  | 'neural-lattice'
  | 'stochastic-grid'
  | 'simplex-frontier'
  | 'vector-manifold'
  | 'harmonic-torus'
  | 'orbital-wave'
  | 'polyhedral-prism';

export interface PortfolioProject {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  category: ProjectCategory;
  status: ProjectStatus;
  mathSymbol: string;
  motif: ProjectGeometryMotif;
  tagline: string;
  summary: string;
  problem: string;
  approach: string;
  mathematicalConnection: string;
  notes: string;
  techStack: string[];
  features: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'algebratu-finite-group-explorer',
    index: '01',
    title: 'AlgebraTu — Finite Group Explorer',
    shortTitle: 'AlgebraTu',
    category: 'Mathematics',
    status: 'Built · Local',
    mathSymbol: 'G',
    motif: 'group-symmetry',
    tagline: 'Interactive exploration of finite Abelian, permutation, and dihedral groups.',
    summary:
      'An interactive mathematics application built to visualize and verify finite group structures, subgroup properties, element orders, and Cayley tables.',
    problem:
      'Abstract algebra concepts such as cyclic decompositions, symmetry operations, and Cayley multiplication tables can feel opaque without immediate interactive experimentation.',
    approach:
      'Constructed a Python and Streamlit computational workspace backed by SymPy, NumPy, Pandas, and Matplotlib to compute group invariants and render structured tables dynamically.',
    mathematicalConnection:
      'Directly grounded in CASPAM abstract algebra coursework: Lagrange’s theorem, direct products of cyclic groups, symmetric/alternating permutations (Sₙ, Aₙ), and dihedral symmetries (Dₙ).',
    notes:
      'Built and run as a local Python/Streamlit application for interactive mathematical study and visualization.',
    techStack: ['Python', 'Streamlit', 'SymPy', 'NumPy', 'Pandas', 'Matplotlib'],
    features: [
      'Finite Abelian group direct-product decomposition and element order analysis',
      'Permutation group (symmetric & alternating) cycle evaluation',
      'Dihedral group Dₙ rotation and reflection exploration',
      'Automated Cayley table generation and order-based visual summaries',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'muavin-ai-assistant',
    index: '02',
    title: 'Muavin AI Assistant & ZYNEX',
    shortTitle: 'Muavin & ZYNEX',
    category: 'AI & ML',
    status: 'Built',
    mathSymbol: 'λ',
    motif: 'neural-lattice',
    tagline: 'Conversational AI assistant architectures for portfolio Q&A and streaming multi-turn dialogue.',
    summary:
      'Two complementary assistant builds: Muavin (an embedded portfolio assistant answering questions about Ateeq’s background and projects) and ZYNEX (a full-stack Gemini streaming assistant with SSE, Markdown rendering, and persona controls).',
    problem:
      'Static portfolio pages force visitors to hunt across tabs for details, while generic chat wrappers expose API keys or lack clean streaming UX.',
    approach:
      'Implemented a secure Express backend proxy communicating with the Gemini API via Server-Sent Events (SSE) in ZYNEX, paired with structured portfolio context grounding for Muavin.',
    mathematicalConnection:
      'Explores contextual token conditioning, cosine/semantic relevance in prompt context, and low-latency streaming state machines.',
    notes:
      'ZYNEX source code and live interface are publicly hosted on GitHub Pages; server-side API calls keep credentials isolated from browser bundles.',
    techStack: ['TypeScript', 'React', 'Express', 'SSE Streaming', '@google/genai', 'Tailwind CSS'],
    features: [
      'Token-by-token streaming inference via Server-Sent Events (SSE)',
      'Multi-turn conversation memory with local browser persistence',
      'Customizable assistant personas (Balanced, Concise, Creative, Technical)',
      'Markdown & syntax-highlighted code rendering with speech playback and Markdown export',
    ],
    githubUrl: 'https://github.com/callmemrsheeqa-oss/zynex',
    liveUrl: 'https://callmemrsheeqa-oss.github.io/zynex/',
    featured: true,
  },
  {
    slug: 'stockout-risk-prediction',
    index: '03',
    title: 'Stockout Risk Prediction',
    shortTitle: 'Stockout Risk',
    category: 'AI & ML',
    status: 'In Progress',
    mathSymbol: 'Δ',
    motif: 'stochastic-grid',
    tagline: 'Estimating inventory depletion risk to inform proactive restocking decisions.',
    summary:
      'A machine-learning exploration focused on identifying products at elevated risk of running out of stock before demand spikes deplete safety buffers.',
    problem:
      'Unanticipated stockouts disrupt customer trust and operations, yet simple static reorder thresholds ignore demand variability and lead-time uncertainty.',
    approach:
      'Structuring relevant inventory features (historical velocity, lead-time variance, safety stock ratios) to train and evaluate an interpretable baseline classification/risk-scoring pipeline.',
    mathematicalConnection:
      'Connects probability distributions, conditional risk estimation, and threshold optimization under asymmetric inventory costs.',
    notes:
      'Actively in development. No synthetic accuracy metrics or production deployment are claimed while dataset evaluation is ongoing.',
    techStack: ['Python', 'Machine Learning', 'Inventory Analytics', 'Data Modeling'],
    features: [
      'Feature exploration around demand velocity and lead-time volatility',
      'Baseline classification pipeline for early risk flagging',
      'Transparent distinction between experimental validation and production readiness',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'portfolio-optimization',
    index: '04',
    title: 'Portfolio Optimization',
    shortTitle: 'Portfolio Opt.',
    category: 'Mathematics',
    status: 'Exploration',
    mathSymbol: '∇',
    motif: 'simplex-frontier',
    tagline: 'Convex optimization and variance minimization over constrained asset allocation spaces.',
    summary:
      'An applied mathematics and quantitative computing exploration examining how quadratic programming balances expected return against portfolio covariance.',
    problem:
      'Allocating weights across correlated assets intuitively often concentrates hidden covariance risk rather than achieving true diversification.',
    approach:
      'Modeling expected return vectors and sample covariance matrices in Python to trace feasible efficient frontiers subject to budget and non-negativity constraints.',
    mathematicalConnection:
      'Built directly on linear algebra, positive semi-definite covariance matrices, Lagrange multipliers, and convex quadratic optimization.',
    notes:
      'Presented as a mathematical and algorithmic study—no financial advice or fabricated backtest returns are claimed.',
    techStack: ['Python', 'Convex Optimization', 'Linear Algebra', 'NumPy'],
    features: [
      'Covariance matrix regularization and constraint formulation',
      'Efficient frontier geometry on the probability simplex',
      'Sensitivity analysis of weight allocations to input perturbations',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'rag-research-paper-assistant',
    index: '05',
    title: 'RAG Research Paper Assistant',
    shortTitle: 'RAG Assistant',
    category: 'AI & ML',
    status: 'Exploration',
    mathSymbol: '∫',
    motif: 'vector-manifold',
    tagline: 'Retrieval-augmented workflows for navigating, querying, and citing dense technical papers.',
    summary:
      'An architectural exploration into combining vector similarity search with grounded LLM synthesis so researchers can interrogate mathematical and ML papers with verifiable citations.',
    problem:
      'Dense academic PDFs contain interwoven definitions, lemmas, and experimental setups that are slow to cross-reference manually, while ungrounded LLMs risk hallucinating citations.',
    approach:
      'Designing a document chunking, embedding, and top-k inner-product retrieval pipeline that feeds strictly bounded source excerpts into synthesis prompts.',
    mathematicalConnection:
      'Applies high-dimensional inner product spaces, cosine similarity geometry, and information-retrieval ranking metrics.',
    notes:
      'Currently in active architectural exploration and prototyping.',
    techStack: ['Python', 'RAG Architecture', 'Embeddings', 'Vector Search', 'LLM APIs'],
    features: [
      'Section-aware document chunking preserving mathematical context',
      'Cosine similarity ranking over dense embedding vectors',
      'Source-grounded answer synthesis prioritizing verifiability',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: true,
  },
  {
    slug: 'calcgame-scientific-snake',
    index: '06',
    title: 'Scientific Calculator + Sensor Snake',
    shortTitle: 'CalcGame',
    category: 'Web & Apps',
    status: 'Built',
    mathSymbol: 'θ',
    motif: 'harmonic-torus',
    tagline: 'Full-featured scientific calculator paired with an accelerometer-controlled Snake game.',
    summary:
      'An interactive dual-mode application uniting a precision scientific calculator (DEG/RAD trig, logs, factorials, memory registers, history) with a tilt-controlled Snake game.',
    problem:
      'Mobile utility apps rarely explore playful sensor interaction alongside clean mathematical computation.',
    approach:
      'Engineered distinct calculator and game modules—supporting real-time accelerometer tilt steering with neutral calibration and low-pass jitter filtering, plus an accessible D-pad fallback.',
    mathematicalConnection:
      'Implements trigonometric domains, DEG/RAD angular transformations, factorial/logarithmic bounds checking, and low-pass signal smoothing for tilt telemetry.',
    notes:
      'Verified public repository and live Vercel preview available.',
    techStack: ['Kotlin', 'Scientific Computation', 'Accelerometer Telemetry', 'Vercel'],
    features: [
      'Trig, inverse, hyperbolic, exponential, logarithmic, and factorial operations',
      'DEG/RAD angle mode toggle with memory registers (MC, MR, M+, M−) and calculation history',
      'Motion tilt steering with neutral orientation calibration and sensitivity presets',
      '180° self-reversal guard and responsive on-screen D-pad fallback',
    ],
    githubUrl: 'https://github.com/callmemrsheeqa-oss/calcgame',
    liveUrl: 'https://calcgame-six.vercel.app',
    featured: true,
  },
  {
    slug: 'image-background-remover',
    index: '07',
    title: 'Image Background Remover',
    shortTitle: 'BG Remover',
    category: 'Web & Apps',
    status: 'Built',
    mathSymbol: '∂',
    motif: 'polyhedral-prism',
    tagline: 'Streamlined web utility automating foreground isolation in a few clicks.',
    summary:
      'A focused web application built to make subject-background separation fast and approachable without manual masking tools.',
    problem:
      'Manual pixel masking in heavy desktop editors is repetitive and slow for everyday assets.',
    approach:
      'Created a clean browser workflow through AI-assisted rapid prototyping so users can isolate subjects effortlessly.',
    mathematicalConnection:
      'Relates to image segmentation masks, alpha-matte boundary feathering, and spatial pixel matrices.',
    notes:
      'Built as an applied utility prototype.',
    techStack: ['Web App', 'Image Processing', 'AI-Assisted Development'],
    features: [
      'Minimal multi-step upload and preview flow',
      'Automated foreground/background separation',
      'Clean downloadable output asset',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
  {
    slug: 'all-video-downloader',
    index: '08',
    title: 'All Video Downloader',
    shortTitle: 'Media Pipeline',
    category: 'Web & Apps',
    status: 'Built · Local',
    mathSymbol: '∞',
    motif: 'orbital-wave',
    tagline: 'Local Flask, yt-dlp, and ffmpeg pipeline with live streamed progress and automated cleanup.',
    summary:
      'A personal full-stack local web application converting media URLs into MP3 audio, video-only streams, or merged high-resolution video with quality selection and streamed progress.',
    problem:
      'Command-line media extraction requires memorizing format flags, managing temporary files, and troubleshooting extractor regressions.',
    approach:
      'Built an isolated Python virtual environment and Flask backend orchestrating yt-dlp, ffmpeg, and Deno, streaming real-time progress events to a clean frontend UI and auto-cleaning completed temporary files.',
    mathematicalConnection:
      'Applies finite state transitions, byte-rate progress interpolation, and deterministic process lifecycle management.',
    notes:
      'Runs locally with automated PowerShell/batch environment setup and health-check scripts; intentionally unhosted.',
    techStack: ['Python', 'Flask', 'yt-dlp', 'ffmpeg', 'JavaScript', 'PowerShell'],
    features: [
      'Selectable MP3, video-only, or merged audio/video output formats up to 1080p',
      'Real-time progress streaming from Flask to the browser',
      'Reproducible venv setup, Deno verification, and health-check maintenance scripts',
      'Automated temporary file expiration and cleanup',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
  {
    slug: 'house-price-prediction',
    index: '09',
    title: 'House Price Prediction',
    shortTitle: 'House Price ML',
    category: 'AI & ML',
    status: 'Built',
    mathSymbol: 'f(x)',
    motif: 'simplex-frontier',
    tagline: 'Regression modeling and web interface for estimating property valuations from features.',
    summary:
      'A machine-learning and web integration project estimating property values from structured housing attributes.',
    problem:
      'Assessing fair property estimates across interacting spatial and structural variables is error-prone without quantitative baselines.',
    approach:
      'Trained a regression baseline on historical housing attributes and connected inference to a straightforward web interface.',
    mathematicalConnection:
      'Applies multivariable regression, feature scaling, residual error minimization, and hyperplane fitting.',
    notes:
      'Built as an applied machine learning learning project; specific benchmark metrics are intentionally omitted where unverified.',
    techStack: ['Python', 'Regression Modeling', 'Web Interface'],
    features: [
      'Structured feature input form connected to trained model inference',
      'Clear separation between exploratory preprocessing and prediction UI',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
  {
    slug: 'english-urdu-translator-concept',
    index: '10',
    title: 'English–Urdu Translator Concept',
    shortTitle: 'EN–Urdu Concept',
    category: 'Concepts',
    status: 'Concept',
    mathSymbol: '⇄',
    motif: 'orbital-wave',
    tagline: 'Bilingual interface concept centered on clarity and bidirectional typography.',
    summary:
      'An application concept exploring effortless translation between English (LTR) and Urdu (RTL) with typographic care.',
    problem:
      'Many bilingual utilities treat right-to-left Nastaliq/Urdu typography as an afterthought, hurting legibility.',
    approach:
      'Designing a minimal split-pane bilingual layout before selecting an underlying neural machine translation API or local model.',
    mathematicalConnection:
      'Connects sequence-to-sequence attention architectures with clean bidirectional UI state.',
    notes:
      'Explicitly documented as a design concept; no live translation engine is claimed yet.',
    techStack: ['Concept Architecture', 'Bilingual UX', 'RTL/LTR Typography'],
    features: [
      'Clean bidirectional English and Urdu layout hierarchy',
      'Planned integration path for neural translation endpoints',
    ],
    githubUrl: null,
    liveUrl: null,
    featured: false,
  },
  {
    slug: 'bzu-exam',
    index: '11',
    title: 'BZU Exam — Online Examination Management Prototype',
    shortTitle: 'BZU Exam',
    category: 'Web & Apps',
    status: 'Built',
    mathSymbol: 'Σ',
    motif: 'stochastic-grid',
    tagline: 'A futuristic university examination demo linking student submissions, teacher marking, and admin-controlled result workflows.',
    summary:
      'An interactive academic prototype inspired by Bahauddin Zakariya University, Multan, designed to demonstrate online exams through separate student, teacher, and administrator dashboards. Uses fictional university accounts and synthetic academic records rather than real institutional data.',
    problem:
      'Coordinating exam creation, time-bound student access, handwritten or typed submissions, marking, and transparent result publication can be fragmented across disconnected tools. A unified prototype helps illustrate a possible university-wide workflow without handling real student records.',
    approach:
      'Designed a React and TypeScript-based interface with a BZU-inspired futuristic theme, role-oriented dashboards, and a separate interactive demo flow. The proposed journey takes a paper from teacher creation through student attempts, MCQ auto-grading, PDF-based subjective review, admin-approved marks revision, and result publication. Browser-local demo data keeps the prototype free from production infrastructure.',
    mathematicalConnection:
      'Combines rule-based grading, weighted score aggregation and percentage calculation with scheduling constraints, countdown timers, and explicit state transitions for exam and result lifecycles.',
    notes:
      'Independent educational prototype, not an official BZU examination portal. Demo identities and academic records are synthetic. Intended for same-browser demonstrations; real authentication, persistent cross-device submission, and production exam security are outside the current scope. Document import, speech input, and PDF annotations may depend on browser support or implementation stage.',
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Browser Storage', 'PDF Workflows'],
    features: [
      'Role-specific student, teacher, and admin views using fictional university accounts',
      'Teacher-designed exams, quizzes, and assignments with a calendar separate from testable demo sessions',
      'MCQ navigation and automatic scoring alongside typed, voice-assisted, or single-PDF subjective submissions',
      'In-browser subjective paper review, marksheets, feedback, and controlled release of checked papers',
      'Admin review of pre-publication marks revision requests with an audit trail',
      'Guided end-to-end examination demo, responsive dashboards, and system-aware light/dark theme',
    ],
    githubUrl: 'https://github.com/callmemrsheeqa-oss/BZU_EXAM',
    liveUrl: null,
    featured: false,
  },
];

export const PROJECT_CATEGORIES: Array<'All' | ProjectCategory> = [
  'All',
  'Mathematics',
  'AI & ML',
  'Web & Apps',
  'Concepts',
];
