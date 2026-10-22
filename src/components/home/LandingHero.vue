
<template>
  <section class="hero">
    <div class="hero-content">
      <v-chip
        variant="tonal"
        class="mb-4"
      >
        Senior Fullstack Engineer
      </v-chip>

      <h1>Simplifying Complex Interfaces</h1>

      <p>
        Fullstack engineer specializing in design systems, responsive web applications, and maintainable interfaces. I work across product, design, and engineering to turn requirements into reliable experiences.
      </p>

      <div class="hero-cta">
        <BaseButton
          color="primary"
          size="large"
          href="#work"
          append-icon="mdi-arrow-down"
        >
          View Selected Work
        </BaseButton>

        <BaseButton
          variant="secondary"
          size="large"
          to="/design-systems"
          append-icon="mdi-arrow-right"
        >
          See My Component Library
        </BaseButton>
      </div>
    </div>

    <div class="hero-decoration" aria-hidden="true">
      <v-icon icon="mdi-code-tags" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  min-height: 320px;
  padding: 48px;
  overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(
    120deg,
    rgb(var(--v-theme-primary)),
    #000
  );
  color: white;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 620px;
}

.hero h1 {
  margin-bottom: 16px;
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 700;
  line-height: 1.15;
}

.hero p {
  max-width: 520px;
  margin-bottom: 28px;
  font-size: 1.1rem;
  line-height: 1.7;
  opacity: 0.9;
}

.hero-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border-radius: 40px;
  background: rgb(255 255 255 / 15%);
  transform: rotate(-8deg);
}

.hero-decoration :deep(.v-icon) {
  font-size: 100px;
  color: white;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 700px) {
  .hero {
    min-height: 280px;
    padding: 28px;
  }

  .hero-decoration {
    display: none;
  }
}
</style>
