<script setup>
const props = defineProps({
  modelValue: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  total: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  loading: Boolean,
})
const emit = defineEmits(['update:modelValue'])

const isFirstPage = () => props.loading || props.modelValue <= 1
const isLastPage = () => props.loading || props.modelValue >= props.pageCount
const goToPage = (page) => {
  if (props.loading || page < 1 || page > props.pageCount || page === props.modelValue) return
  emit('update:modelValue', page)
}
const handlePageSelect = (event) => {
  const selectedPage = Number(event.currentTarget.value)
  if (Number.isInteger(selectedPage)) goToPage(selectedPage)
}
</script>

<template>
  <div class="pagination">
    <div class="pagination-info">{{ total }} rows</div>
    <div class="pagination-controls">
      <span>Rows per page: {{ itemsPerPage }}</span>
      <div class="pager" aria-label="Pagination">
        <v-icon
          icon="mdi-chevron-double-left"
          class="page-control"
          role="button"
          aria-label="First page"
          title="First page"
          :aria-disabled="isFirstPage()"
          :tabindex="isFirstPage() ? -1 : 0"
          @click="goToPage(1)"
          @keydown.enter.prevent="goToPage(1)"
          @keydown.space.prevent="goToPage(1)"
        />
        <v-icon
          icon="mdi-chevron-left"
          class="page-control"
          role="button"
          aria-label="Previous page"
          title="Previous page"
          :aria-disabled="isFirstPage()"
          :tabindex="isFirstPage() ? -1 : 0"
          @click="goToPage(modelValue - 1)"
          @keydown.enter.prevent="goToPage(modelValue - 1)"
          @keydown.space.prevent="goToPage(modelValue - 1)"
        />
        <select
          title="Go to page"
          aria-label="Current page"
          :value="modelValue"
          :disabled="loading"
          @change="handlePageSelect"
        >
          <option v-for="pageNumber in pageCount" :key="pageNumber" :value="pageNumber">
            {{ pageNumber }}
          </option>
        </select>
        <span>of {{ pageCount }}</span>
        <v-icon
          icon="mdi-chevron-right"
          class="page-control"
          role="button"
          aria-label="Next page"
          title="Next page"
          :aria-disabled="isLastPage()"
          :tabindex="isLastPage() ? -1 : 0"
          @click="goToPage(modelValue + 1)"
          @keydown.enter.prevent="goToPage(modelValue + 1)"
          @keydown.space.prevent="goToPage(modelValue + 1)"
        />
        <v-icon
          icon="mdi-chevron-double-right"
          class="page-control"
          role="button"
          aria-label="Last page"
          title="Last page"
          :aria-disabled="isLastPage()"
          :tabindex="isLastPage() ? -1 : 0"
          @click="goToPage(pageCount)"
          @keydown.enter.prevent="goToPage(pageCount)"
          @keydown.space.prevent="goToPage(pageCount)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  color: #5b6272;
  font-size: 0.9rem;
}

.pagination-info {
  margin-right: auto;
}

.pagination-controls,
.pager {
  display: flex;
  align-items: center;
}

.pagination-controls {
  gap: 12px;
}

.pager {
  gap: 6px;
}

.pager select {
  padding: 6px 8px;
  border: 1px solid #2f5bea;
  border-radius: 6px;
  background: #2f5bea;
  color: #fff;
  font-size: 0.9rem;
  text-align: right;
  cursor: pointer;
}

.page-control {
  color: #1f2430;
  cursor: pointer;
}

.page-control[aria-disabled='true'] {
  opacity: 0.45;
  cursor: default;
}
</style>
