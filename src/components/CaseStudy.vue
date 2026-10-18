<template>
  <div class="case-study-list">

    <article class="case-study">
      <div class="case-study-intro">
        <div class="eyebrow">Featured case study</div>
        <h3>Intelvio — Student &amp; Course Platform</h3>
        <p>
          Front-end work on a platform for managing students and courses,
          including design-system improvements, application-wide navigation,
          and a unified course signup experience across multiple brands.
        </p>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">The challenge</div>
          <h4>One product experience across different parts of the application.</h4>
        </div>

        <div class="case-copy">
          <p>
            The application used a mix of Vue and Laravel Blade pages. Navigation
            could look and behave differently depending on where a user was in
            the platform.
          </p>
          <p>
            I integrated Vue into the Blade-based pages so they could use the same
            navigation experience, bringing the different parts of the application
            closer to a shared front-end architecture.
          </p>
          <p>
            I also updated the design system and added reusable components, and
            worked to unify course signup and checkout across multiple brands
            where users could enter the purchasing flow.
          </p>
        </div>
      </div>

      <div class="tech-row">
        <v-chip>Vue.js</v-chip>
        <v-chip>Vuetify.js</v-chip>
        <v-chip>Laravel</v-chip>
        <v-chip>Blade</v-chip>
        <v-chip>JavaScript</v-chip>
        <v-chip>Design Systems</v-chip>
      </div>
    </article>

    <article class="case-study">
      <div class="case-study-intro">
        <!-- <div class="eyebrow">Featured case study</div> -->
        <h3>Awardco — Design System &amp; Front-End Modernization</h3>
        <p>
          Built reusable front-end infrastructure, improved application consistency, and developed
          tools that made complex workflows easier for users and developers.
        </p>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">Design system &amp; component library</div>
          <h4>A shared foundation for consistent interfaces.</h4>
        </div>

        <div class="case-copy">
          <p>
            Built Awardco's standalone, reusable design system largely on my own using Vue 2, Vue 3,
            Sass, and Storybook. The component library gave developers a shared foundation of
            reusable UI components, helping maintain consistency across the application and making
            interfaces easier to build and maintain.
          </p>
        </div>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">Navigation refactor</div>
          <h4>A cleaner, more maintainable navigation experience.</h4>
        </div>

        <div class="case-copy">
          <p>
            Rebuilt the application's navigation, replacing a poorly integrated purchased layout
            with a cleaner implementation. Eliminated redundant code and standardized navigation
            behavior, improving consistency and simplifying future maintenance.
          </p>
        </div>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">Standardized page layouts</div>
          <h4>Consistent page structure and clearer feedback.</h4>
        </div>

        <div class="case-copy">
          <p>
            Implemented a consistent page design featuring fixed page titles, breadcrumb navigation,
            and warnings about losing unsaved changes. These patterns helped users understand their
            location in the application and avoid losing work.
          </p>
        </div>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">Vue 2 to Vue 3</div>
          <h4>Modernizing the front-end codebase.</h4>
        </div>

        <div class="case-copy">
          <p>
            Contributed to migrating application pages from Vue 2 to Vue 3, helping modernize the
            front-end codebase and maintain consistency across the application during the transition.
          </p>
        </div>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">CSV upload verification</div>
          <h4>Correct data without repeating the upload process.</h4>
        </div>

        <div class="case-copy">
          <p>
            Created an interactive CSV upload tool that validated file formats, required columns,
            data integrity, and duplicate entries before import. Users could preview data and correct
            it directly in the tool by editing values, deleting records, or adding new ones. This
            eliminated repeated file edits and uploads to resolve data issues.
          </p>
        </div>
      </div>

      <div class="case-study-details">
        <div>
          <div class="case-label">Embedded calendar</div>
          <h4>Calendar functionality built into the application.</h4>
        </div>

        <div class="case-copy">
          <p>
            Developed an embedded calendar system that displayed events and schedules, supported
            booking and appointment management, and integrated existing calendar functionality
            directly into the application.
          </p>
        </div>
      </div>

      <div class="tech-row">
        <v-chip>Vue 2</v-chip>
        <v-chip>Vue 3</v-chip>
        <v-chip>Storybook</v-chip>
        <v-chip>Sass</v-chip>
        <v-chip>Design Systems</v-chip>
        <v-chip>CSV Validation</v-chip>
      </div>
    </article>

  </div>
</template>