export type InterestArtworkMode = 'torus-knot' | 'lorenz-flow' | 'polyhedral-lattice' | 'harmonic-wave';

export interface InterestDomain {
  id: string;
  index: string;
  symbol: string;
  title: string;
  subtitle: string;
  description: string;
  formulaLabel: string;
  artworkMode: InterestArtworkMode;
  tags: string[];
}

export const INTEREST_DOMAINS: InterestDomain[] = [
  {
    id: 'mathematics',
    index: '01',
    symbol: '∑',
    title: 'Pure & Applied Mathematics',
    subtitle: 'Symmetry, Structure & Abstract Algebra',
    description:
      'The logical backbone behind computation. From finite group symmetries and topological knots to optimization over vector spaces, mathematics turns intuition into verifiable truth.',
    formulaLabel: 'G / N ≅ im(φ) · Cayley & Knot Manifolds',
    artworkMode: 'torus-knot',
    tags: ['Abstract Algebra', 'Linear Spaces', 'Topology', 'Proof'],
  },
  {
    id: 'machine-learning',
    index: '02',
    symbol: '∇',
    title: 'Artificial Intelligence & ML',
    subtitle: 'Dynamical Systems & Pattern Inference',
    description:
      'Teaching machines to extract structure from noisy high-dimensional observations—connecting gradient flows, probability theory, and retrieval-augmented reasoning.',
    formulaLabel: 'dx/dt = σ(y − x) · Gradient & State Trajectories',
    artworkMode: 'lorenz-flow',
    tags: ['Predictive Models', 'RAG Pipelines', 'Optimization', 'Inference'],
  },
  {
    id: 'creative-tech',
    index: '03',
    symbol: '∂',
    title: 'Creative Web & Spatial 3D',
    subtitle: 'Interactive Geometry in the Browser',
    description:
      'Combining React, TypeScript, and WebGL shaders to turn equations and technical concepts into responsive, tactile visual experiences people enjoy exploring.',
    formulaLabel: 'R(θ, φ) ∈ SO(3) · Real-Time Spatial Transforms',
    artworkMode: 'polyhedral-lattice',
    tags: ['Three.js', 'React Three Fiber', 'Interactive UI', 'Motion'],
  },
  {
    id: 'useful-software',
    index: '04',
    symbol: '∫',
    title: 'Practical Problem Solving',
    subtitle: 'Turning Everyday Friction into Tools',
    description:
      'Building focused utilities—from finite group visualizers to local media pipelines and educational apps—guided by continuous curiosity and steady iteration.',
    formulaLabel: '∫ f(t) e^(−iωt) dt · Signal Synthesis & Utility',
    artworkMode: 'harmonic-wave',
    tags: ['Python Utilities', 'Full-Stack Apps', 'Continuous Learning', 'Teaching'],
  },
];
