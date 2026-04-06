export interface Program {
  id: string
  title: string
  description: string
  details: string[]
  icon: string
  duration?: string
  highlight?: string
}

export const programs: Program[] = [
  {
    id: 'summer-internship',
    title: 'Summer Internships (USA → Zambia)',
    description:
      'Immersive professional experiences placing U.S. students in Zambian organizations, NGOs, and community projects for 4–8 weeks.',
    details: [
      'Placements in education, public health, conservation, and development sectors',
      'Structured weekly check-ins and mentor support',
      'Credit-bearing options aligned with U.S. academic standards',
      'Pre-departure orientation and cultural training included',
    ],
    icon: 'Briefcase',
    duration: '4–8 weeks',
    highlight: 'Credit-bearing',
  },
  {
    id: 'study-abroad',
    title: 'Study Abroad Program Design',
    description:
      'End-to-end facilitation for institutions seeking to offer semester or short-term study abroad in Zambia, with custom academic curricula.',
    details: [
      'Custom curriculum design with local partner institutions',
      'Academic credit transfer coordination with U.S. colleges',
      'Faculty-led and independent program options',
      'Flexible program lengths: 2 weeks to full semester',
    ],
    icon: 'BookOpen',
    duration: 'Flexible',
    highlight: 'Institution Partnerships',
  },
  {
    id: 'homestay',
    title: 'Homestay & Housing Coordination',
    description:
      'Carefully vetted homestay families and student housing options that provide authentic cultural immersion in a safe, welcoming environment.',
    details: [
      'Thoroughly screened Zambian host families',
      'Student dormitory and shared housing alternatives',
      'Regular check-ins and host family support',
      'Emergency housing protocols in place',
    ],
    icon: 'Home',
    duration: 'Program duration',
    highlight: 'Fully Vetted',
  },
  {
    id: 'orientation',
    title: 'Orientation & Intercultural Training',
    description:
      'Comprehensive pre-departure and in-country orientation workshops that prepare students for life and learning in Zambia.',
    details: [
      'Pre-departure cultural sensitivity training',
      'Zambian history, customs, and social norms overview',
      'Health, safety, and emergency preparedness briefing',
      'Ongoing reflection sessions during the program',
    ],
    icon: 'Users',
    duration: '2–5 days',
    highlight: 'Included Free',
  },
  {
    id: 'visa-travel',
    title: 'Visa Guidance & Travel Coordination',
    description:
      'Step-by-step support navigating visa applications, flight planning, and in-country transportation from arrival to departure.',
    details: [
      'Zambia visa application guidance and document review',
      'Airport pickup and drop-off coordination',
      'In-country transportation for program activities',
      'Travel insurance recommendations and support',
    ],
    icon: 'Globe',
    duration: 'Ongoing support',
    highlight: 'Stress-Free Travel',
  },
  {
    id: 'language-immersion',
    title: 'Language & Cultural Immersion',
    description:
      'Hands-on language introduction workshops and curated cultural activities—from traditional ceremonies to community visits—for authentic connection.',
    details: [
      'Introduction to Bemba, Nyanja, or Tonga (region-specific)',
      'Community visits, craft workshops, and traditional ceremonies',
      'Collaboration with local artisans and cultural leaders',
      'Guided nature and wildlife experiences',
    ],
    icon: 'Mic',
    duration: 'Integrated throughout',
    highlight: 'Authentic Experience',
  },
]
