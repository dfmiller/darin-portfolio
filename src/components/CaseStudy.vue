<template>
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
      <span>Vue.js</span>
      <span>Laravel</span>
      <span>Blade</span>
      <span>JavaScript</span>
      <span>Design Systems</span>
    </div>
  </article>
</template>
