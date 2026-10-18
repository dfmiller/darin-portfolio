
<template>
  <div class="page-content">
    <div class="intro">
      <h2>Your resources</h2>
      <p>Keep useful links and reference material organized.</p>
    </div>

    <v-card class="mt-6" variant="outlined" rounded="lg">
      <v-empty-state
        headline="Nothing here yet"
        title="Your resources will appear here"
        text="This is a starting point. We can add resource management when you're ready."
        icon="mdi-folder-open-outline"
      />
    </v-card>
  </div>
</template>

<style scoped>
.page-content {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
}

.intro h2 {
  margin-bottom: 6px;
  font-size: 1.5rem;
  font-weight: 600;
}

.intro p {
  opacity: 0.7;
}
</style>
