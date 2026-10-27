export interface ExperienceItem {
  dates: string
  title: string
  company: string
  description: string
  sample?: {
    label: string
    href: string
  }
}

export interface StrengthItem {
  label: string
  title: string
  description: string
}

export interface ProfileHero {
  chip: string
  headline: string
  intro: string
}

export const hero: ProfileHero = {
  chip: 'Senior Fullstack Engineer',
  headline: 'Simplifying Complex Interfaces',
  intro:
    'Fullstack engineer specializing in Vue, design systems, and accessible, pixel-accurate interfaces, with PHP and MySQL roots going back to the late 1990s and Laravel REST APIs behind them. I work across product, design, and engineering, and use AI tools daily to turn requirements into reliable experiences.',
}

export const skills: string[] = [
  'Vue.js 2 & 3',
  'Pinia',
  'Vuex',
  'Vuetify',
  'JavaScript',
  'TypeScript',
  'HTML5',
  'CSS3',
  'SASS',
  'React',
  'Storybook',
  'Design Systems',
  'Reusable Components',
  'Accessibility',
  'Flutter',
  'PHP',
  'Laravel',
  'REST APIs',
  'MySQL',
  'Git',
  'GitHub Actions (CI/CD)',
  'AWS',
  'D3',
  'AI-assisted development',
]

export const experience: ExperienceItem[] = [
  {
    dates: 'Oct 2025 – Oct 2026',
    title: 'Senior Software Engineer',
    company: 'Intelvio',
    description:
      'Laravel 11 and Vue admin platform for managing in-person and online classes, plus customer checkout flows. Developed features, fixed bugs, extended the design system and built pages demonstrating its use, and worked on upgrading the Vue 2 front end to Vue 3. Used AI-assisted tools daily for debugging, prototyping, and refactoring.',
    sample: {
        label: 'View screenshots of the checkout',
        href: '/checkout',
      }
  },
  {
    dates: 'Feb 2022 – Sep 2025',
    title: 'Senior Front-End Engineer',
    company: 'Awardco',
    description:
      'Built and maintained reusable Vue components in a shared design system used by a dozen engineering teams across the web applications of a B2B employee-recognition platform. Worked on accessibility, performed code reviews, shipped through GitHub Actions CI/CD pipelines, migrated legacy and Vue 2 applications to Vue 3, and re-architected desktop and mobile navigation for performance and clarity.',
  },
  {
    dates: 'Mar 2018 – Feb 2022',
    title: 'Web Developer',
    company: 'Kingsley Management Corp',
    description:
      'Migrated an existing internal web application to Vue.js, wrote Laravel/PHP back-end code and REST APIs backed by MySQL, and helped build a Flutter cross-platform mobile app from scratch with product managers and designers. Also resolved bugs in legacy internal systems and improved styling across websites and mobile applications. Worked in a small, fast-moving team.',
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
      'Building shared components and systems, including one used by a dozen engineering teams, that create visual and interaction consistency across applications.',
  },
  {
    label: 'Modernization',
    title: 'Vue architecture',
    description:
      'Experience with Vue 2 and Vue 3, including migrations and navigation re-architecture, reducing technical debt through planning and cross-team coordination.',
  },
  {
    label: 'Product thinking',
    title: 'From requirements to UI',
    description:
      'Working with product managers, designers, and back-end engineers to turn product requirements into accessible, pixel-accurate, maintainable interfaces.',
  },
  {
    label: 'Full stack',
    title: 'Front end to API',
    description:
      'PHP and MySQL since the late 1990s, with Laravel REST APIs serving Vue and Flutter front ends, so I understand both sides of the interfaces I build.',
  },
  {
    label: 'AI-assisted development',
    title: 'Faster, with judgment',
    description:
      'Daily use of AI tools for prototyping, debugging, and refactoring, always paired with careful review of the output.',
  },
  {
    label: 'Complex applications',
    title: 'Bridging systems',
    description:
      'Solving front-end problems in applications that combine different technologies, rendering approaches, and product experiences.',
  },
]

export interface CaseStudySection {
  label: string
  heading: string
  paragraphs: string[]
  sample?: {
    label: string
    href: string
  }
}

export interface CaseStudy {
  eyebrow?: string
  title: string
  intro: string
  sections: CaseStudySection[]
  tech: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    eyebrow: 'Featured case study',
    title: 'Intelvio — Student & Course Platform',
    intro:
      'Front-end work on a platform for managing students and courses, including design-system improvements, application-wide navigation, and a unified course signup experience across multiple brands.',
    sections: [
      {
        label: 'The challenge',
        heading:
          'One product experience across different parts of the application.',
        paragraphs: [
          'The application used a mix of Vue and Laravel Blade pages. Navigation could look and behave differently depending on where a user was in the platform.',
          'I integrated Vue into the Blade-based pages so they could use the same navigation experience, bringing the different parts of the application closer to a shared front-end architecture.',
          'I also updated the design system and added reusable components, and worked to unify course signup and checkout across multiple brands where users could enter the purchasing flow.',
        ],
        sample: {
          label: 'View screenshots of the checkout',
          href: '/checkout',
        }
      },
    ],
    tech: [
      'Vue.js',
      'Vuetify.js',
      'Laravel',
      'Blade',
      'JavaScript',
      'Design Systems',
      'Reusable Components',
    ],
  },
  {
    title: 'Awardco — Design System & Front-End Modernization',
    intro:
      'Built reusable front-end infrastructure, improved application consistency, and developed tools that made complex workflows easier for users and developers.',
    sections: [
      {
        label: 'Design system & component library',
        heading: 'A shared foundation for consistent interfaces.',
        paragraphs: [
          "Built Awardco's standalone, reusable design system largely on my own using Vue 2, Vue 3, Sass, and Storybook. The component library gave developers a shared foundation of reusable UI components, helping maintain consistency across the application and making interfaces easier to build and maintain.",
        ],
      },
      {
        label: 'Navigation refactor',
        heading: 'A cleaner, more maintainable navigation experience.',
        paragraphs: [
          "Rebuilt the application's navigation, replacing a poorly integrated purchased layout with a cleaner implementation. Eliminated redundant code and standardized navigation behavior, improving consistency and simplifying future maintenance.",
        ],
      },
      {
        label: 'Standardized page layouts',
        heading: 'Consistent page structure and clearer feedback.',
        paragraphs: [
          'Implemented a consistent page design featuring fixed page titles, breadcrumb navigation, and warnings about losing unsaved changes. These patterns helped users understand their location in the application and avoid losing work.',
        ],
      },
      {
        label: 'Vue 2 to Vue 3',
        heading: 'Modernizing the front-end codebase.',
        paragraphs: [
          'Contributed to migrating application pages from Vue 2 to Vue 3, helping modernize the front-end codebase and maintain consistency across the application during the transition.',
        ],
      },
      {
        label: 'CSV upload verification',
        heading: 'Correct data without repeating the upload process.',
        paragraphs: [
          'Created an interactive CSV upload tool that validated file formats, required columns, data integrity, and duplicate entries before import. Users could preview data and correct it directly in the tool by editing values, deleting records, or adding new ones. This eliminated repeated file edits and uploads to resolve data issues.',
        ],
      },
      {
        label: 'Embedded calendar',
        heading: 'Calendar functionality built into the application.',
        paragraphs: [
          'Developed an embedded calendar system that displayed events and schedules, supported booking and appointment management, and integrated existing calendar functionality directly into the application.',
        ],
      },
    ],
    tech: [
      'Vue 2',
      'Vue 3',
      'Storybook',
      'Sass',
      'Design Systems',
      'Reusable Components',
      'CSV Validation',
    ],
  },
]