export interface ExperienceItem {
  dates: string
  title: string
  company: string
  description: string
}

export interface StrengthItem {
  label: string
  title: string
  description: string
}

export const skills: string[] = [
  'Vue.js 2 & 3',
  'Vuetify',
  'JavaScript',
  'TypeScript',
  'HTML5',
  'CSS3',
  'SASS',
  'LESS',
  'React',
  'jQuery',
  'Storybook',
  'Design Systems',
  'Flutter',
  'PHP',
  'Laravel',
  'MySQL',
  'Git',
  'AWS',
  'D3',
]

export const experience: ExperienceItem[] = [
  {
    dates: 'Oct 2025 – Oct 2026',
    title: 'Senior Software Engineer',
    company: 'Intelvio',
    description:
      'Student and course management platform; front-end-focused feature development, bug fixing, design-system work, navigation, and checkout.',
  },
  {
    dates: 'Feb 2022 – Sep 2025',
    title: 'Senior Front-End Engineer',
    company: 'Awardco',
    description:
      'Senior front-end engineering across a multi-app product environment.',
  },
  {
    dates: 'Mar 2018 – Feb 2022',
    title: 'Senior Front-end Developer',
    company: 'Kingsley Management Corp',
    description:
      'Migrated an existing internal web application to Vue.js, developed a mobile application using Flutter, resolved bugs in legacy internal systems, and improved styling across websites and mobile applications.',
  },
  {
    dates: 'Apr 2015 – Oct 2017',
    title: 'Front-End Developer',
    company: 'Leo Insights',
    description:
      'Development of BI UIs showing user configurable tables, diagrams, and charts. Also created company’s responsive website.',
  },
  {
    dates: 'Nov 2011 – Mar 2015',
    title: 'Web Developer',
    company: 'Marketecture',
    description:
      'Development of multiple company website creation tool, with related tools, used by thousands of small businesses.',
  },
]

export const strengths: StrengthItem[] = [
  {
    label: 'Design systems',
    title: 'Reusable UI',
    description:
      'Building shared components and systems that create visual and interaction consistency across applications.',
  },
  {
    label: 'Modernization',
    title: 'Vue architecture',
    description:
      'Experience with Vue 2 and Vue 3, including modernization work and reducing technical debt through planning and coordination.',
  },
  {
    label: 'Product thinking',
    title: 'From requirements to UI',
    description:
      'Working with product managers, designers, and back-end engineers to turn product requirements into maintainable interfaces.',
  },
  {
    label: 'Complex applications',
    title: 'Bridging systems',
    description:
      'Solving front-end problems in applications that combine different technologies, rendering approaches, and product experiences.',
  },
]
