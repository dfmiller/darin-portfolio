
<template>
  <div
    class="page-header"
    :class="{ 'page-header--section-nav': links?.length }"
  >
    <div class="page-header-content">
      <div class="page-header-title">
        <h1 v-if="title">{{ title }}</h1>
        <small v-if="subtitle">{{ subtitle }}</small>
      </div>
      <div id="page-header-tabs" class="page-header-tabs" />
      <nav v-if="links?.length" aria-label="Page sections">
        <a
          v-for="link in links"
          :key="link.href"
          :href="link.href"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string,
  subtitle?: string,
  links?: { label: string, href: string }[],
}>()
</script>

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 20px 24px;
  background: rgb(var(--v-theme-background));
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.page-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.page-header-title {
  min-width: 0;
}

.page-header--section-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.page-header-tabs {
  margin-bottom: -24px;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

a {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  color: inherit;
  font-size: 0.9rem;
  text-decoration: none;
}

a:hover {
  color: rgb(var(--v-theme-primary));
}

@media (max-width: 600px) {
  .page-header--section-nav {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
  }

  nav {
    gap: 8px 16px;
  }

  .page-header-content {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
