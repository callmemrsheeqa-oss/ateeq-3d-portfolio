export interface TeachingSubject {
  id: string;
  index: string;
  level: string;
  title: string;
  focus: string;
  topics: string[];
}

export interface TeachingStep {
  index: string;
  title: string;
  description: string;
}

export const TEACHING_PROFILE = {
  headline: 'Clarity first. Confidence follows.',
  summary:
    'With approximately two years of hands-on teaching experience across Class 1 through Class 12, I help students replace rote memorization with genuine mathematical understanding.',
  audienceRange: 'Class 1 – Class 12',
  experienceDuration: '~2 Years Experience',
  mode: 'Foundational, Secondary & Higher Secondary Mathematics',
  location: 'Multan, Pakistan · Online & In-Person Enquiries',
};

export const TEACHING_SUBJECTS: TeachingSubject[] = [
  {
    id: 'foundations',
    index: '01',
    level: 'Classes 1 – 5',
    title: 'Arithmetic & Number Sense',
    focus: 'Building fearless fluency with numbers, fractions, ratios, and everyday word problems.',
    topics: ['Number Operations', 'Fractions & Decimals', 'Word Problems', 'Basic Geometry'],
  },
  {
    id: 'middle',
    index: '02',
    level: 'Classes 6 – 8',
    title: 'Pre-Algebra & Geometric Reasoning',
    focus: 'Bridging arithmetic into symbolic expressions, linear equations, and spatial measurement.',
    topics: ['Algebraic Expressions', 'Linear Equations', 'Triangles & Circles', 'Percentages & Ratios'],
  },
  {
    id: 'matric',
    index: '03',
    level: 'Classes 9 – 10',
    title: 'Algebra, Matrices & Deductive Geometry',
    focus: 'Mastering quadratic systems, logarithms, trigonometric ratios, and formal geometric proofs.',
    topics: ['Matrices & Determinants', 'Quadratic Equations', 'Logarithms', 'Trigonometry & Theorems'],
  },
  {
    id: 'intermediate',
    index: '04',
    level: 'Classes 11 – 12',
    title: 'Calculus, Analytic Geometry & Vectors',
    focus: 'Developing precision in functions, limits, derivatives, integrals, conic sections, and vector spaces.',
    topics: ['Functions & Limits', 'Differentiation', 'Integration', 'Conics & Vectors'],
  },
];

export const TEACHING_METHODOLOGY: TeachingStep[] = [
  {
    index: '01',
    title: 'Diagnose the Missing Link',
    description:
      'Struggles in higher mathematics almost always trace back to one unclarified earlier concept. We locate and strengthen that link first.',
  },
  {
    index: '02',
    title: 'Visual & Intuitive Framing',
    description:
      'Before introducing symbolic manipulation, we map what an equation means geometrically or practically so formulas feel logical.',
  },
  {
    index: '03',
    title: 'Guided Stepwise Practice',
    description:
      'Students work through structured problem tiers—moving from guided derivations to independent exam-ready reasoning.',
  },
];
