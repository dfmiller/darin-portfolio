<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  total: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  loading: Boolean,
  itemsPerPageReadonly: Boolean,
})
const emit = defineEmits(['update:modelValue', 'update:itemsPerPage'])
const pageSizeOptions = computed(() => [...new Set([5, 10, 25, 50, 100, props.itemsPerPage])].sort((a, b) => a - b))

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
const handlePageSizeSelect = (event) => {
  const selectedSize = Number(event.currentTarget.value)
  if (Number.isInteger(selectedSize) && selectedSize > 0 && selectedSize !== props.itemsPerPage) {
    emit('update:itemsPerPage', selectedSize)
  }
}
</script>

<template>
  <div class="pagination">
    <div class="pagination-summary">
      <div class="pagination-info">{{ total }} rows</div>
      <div class="pagination-no-wrap">
        <span>Rows per page:</span>
        <select
          v-if="!itemsPerPageReadonly"
          class="page-size-select"
          aria-label="Rows per page"
          :value="itemsPerPage"
          :disabled="loading"
          @change="handlePageSizeSelect"
        >
          <option v-for="pageSize in pageSizeOptions" :key="pageSize" :value="pageSize">
            {{ pageSize }}
          </option>
        </select>
        <span v-else class="page-size-value">{{ itemsPerPage }}</span>
      </div>
    </div>
    <nav class="pager" aria-label="Pagination">
      <button
        type="button"
        class="page-control"
        aria-label="First page"
        title="First page"
        :disabled="isFirstPage()"
        @click="goToPage(1)"
      >
        <v-icon icon="mdi-chevron-double-left" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="page-control"
        aria-label="Previous page"
        title="Previous page"
        :disabled="isFirstPage()"
        @click="goToPage(modelValue - 1)"
      >
        <v-icon icon="mdi-chevron-left" aria-hidden="true" />
      </button>
      <div class="pagination-no-wrap">
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
      </div>
      <button
        type="button"
        class="page-control"
        aria-label="Next page"
        title="Next page"
        :disabled="isLastPage()"
        @click="goToPage(modelValue + 1)"
      >
        <v-icon icon="mdi-chevron-right" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="page-control"
        aria-label="Last page"
        title="Last page"
        :disabled="isLastPage()"
        @click="goToPage(pageCount)"
      >
        <v-icon icon="mdi-chevron-double-right" aria-hidden="true" />
      </button>
    </nav>
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
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.9rem;
}

.pagination-info {
  margin-right: auto;
}

.pagination-summary,
.pager {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.pagination-summary {
  display: contents;
}

.pager {
  justify-self: end;
  gap: 6px;
}

.pager select {
  padding: 6px 8px;
  border: 1px solid rgb(var(--v-theme-primary));
  border-radius: 6px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  font-size: 0.9rem;
  text-align: right;
  cursor: pointer;
}

.pager select,
.page-size-select {
  scrollbar-width: none;
}

.pager select::-webkit-scrollbar,
.page-size-select::-webkit-scrollbar {
  display: none;
}

.pager option,
.page-size-select option {
  padding-right: 12px;
}

.page-size-select {
  margin-left: 4px;
  padding: 5px 8px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: inherit;
  text-align: right;
  cursor: pointer;
}

.page-size-select:disabled {
  cursor: default;
}

.page-control {
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: rgb(var(--v-theme-on-surface));
  cursor: pointer;
}

.page-control:disabled {
  opacity: 0.45;
  cursor: default;
}

.page-control:focus-visible,
.pager select:focus-visible,
.page-size-select:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}
.pagination-no-wrap {
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .pagination-summary {
    display: flex;
    flex-basis: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .pagination-info {
    margin-right: 0;
  }

  .pager {
    flex: 1 1 auto;
    justify-content: flex-end;
  }
}
</style>
