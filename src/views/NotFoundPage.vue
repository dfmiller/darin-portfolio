<template>
  <main class="not-found">
    <v-icon icon="mdi-map-marker-question-outline" size="48" color="primary" aria-hidden="true" />
    <p class="not-found-code">404</p>
    <h1>Page not found</h1>
    <p class="not-found-message">
      The page you’re looking for doesn’t exist or may have moved.
    </p>
    <BaseButton to="/">Back to home</BaseButton>
  </main>
</template>

<style scoped>
.not-found {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.not-found-code {
  margin: 16px 0 0;
  color: rgb(var(--v-theme-primary));
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 700;
  letter-spacing: -0.08em;
  line-height: 1;
}

.not-found h1 {
  margin: 16px 0 0;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
}

.not-found-message {
  margin: 12px 0 24px;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
