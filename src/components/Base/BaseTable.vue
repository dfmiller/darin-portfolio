<script setup>
// columns: [{ key, label }] replaces Vuetify's headers shape.
import { ref, computed, watch } from 'vue'
import BasePagination from './BasePagination.vue'
const props = defineProps({
  columns: Array,
  rows: Array,
  itemsPerPage: { type: Number, default: 10 },
  page: { type: Number, default: 1 },
  serverItemsLength: Number,
  loading: Boolean,
  hideDefaultFooter: Boolean,
  fixedHeader: Boolean,
  height: [Number, String],
  rowClickable: Boolean,
})
const emit = defineEmits(['update:page', 'update:items-per-page', 'click:row'])
const q = ref('')
const sortBy = ref([])
const localPage = ref(props.page)
const localItemsPerPage = ref(props.itemsPerPage)
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const headers = computed(() => props.columns.map(c => ({
  title: c.label,
  key: c.key,
  sortable: c.sortable ?? c.key !== 'actions',
})))
const tableComponent = computed(() => props.serverItemsLength === undefined ? 'v-data-table' : 'v-data-table-server')
const activePage = computed(() => props.serverItemsLength === undefined ? localPage.value : props.page)
watch(() => props.page, page => {
  localPage.value = page
})
watch(() => props.itemsPerPage, itemsPerPage => {
  localItemsPerPage.value = itemsPerPage
})
const handlePageUpdate = page => {
  if (props.serverItemsLength === undefined) localPage.value = page
  emit('update:page', page)
}
const handlePageSizeUpdate = itemsPerPage => {
  localItemsPerPage.value = itemsPerPage
  emit('update:items-per-page', itemsPerPage)
  handlePageUpdate(1)
}
const handleRowClick = (_event, { item }) => emit('click:row', item)
const handleRowKeydown = (event, item) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return
  event.preventDefault()
  emit('click:row', item)
}
const rowProps = ({ item }) => props.rowClickable
  ? {
      tabindex: 0,
      onKeydown: event => handleRowKeydown(event, item),
    }
  : {}
const filteredRows = computed(() => {
  const query = q.value.trim().toLocaleLowerCase()
  if (!query) return props.rows

  return props.rows.filter(row => props.columns.some(({ key }) => {
    const value = row[key]
    return value != null && String(value).toLocaleLowerCase().includes(query)
  }))
})
const sortedRows = computed(() => {
  const [sort] = sortBy.value
  if (!sort) return filteredRows.value

  const direction = sort.order === 'desc' ? -1 : 1
  return [...filteredRows.value].sort((a, b) => {
    const aValue = a[sort.key]
    const bValue = b[sort.key]
    const aEmpty = aValue == null || aValue === ''
    const bEmpty = bValue == null || bValue === ''

    if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1

    const result = typeof aValue === 'number' && typeof bValue === 'number'
      ? aValue - bValue
      : collator.compare(String(aValue), String(bValue))
    return result * direction
  })
})
const paginationTotal = computed(() => props.serverItemsLength ?? sortedRows.value.length)
const pageCount = computed(() => Math.max(1, Math.ceil(paginationTotal.value / Math.max(1, localItemsPerPage.value))))
watch(pageCount, count => {
  if (props.serverItemsLength === undefined && localPage.value > count) {
    handlePageUpdate(count)
  }
})
const tableProps = computed(() => ({
  headers: headers.value,
  items: sortedRows.value,
  sortBy: sortBy.value,
  density: 'comfortable',
  itemsPerPage: localItemsPerPage.value,
  hideDefaultFooter: true,
  fixedHeader: props.fixedHeader,
  height: props.height,
  page: activePage.value,
  rowProps,
  ...(props.serverItemsLength === undefined
    ? {}
    : {
        itemsLength: props.serverItemsLength,
        loading: props.loading,
      }),
}))
const mobileRows = computed(() => {
  if (props.serverItemsLength !== undefined) return sortedRows.value
  const start = (activePage.value - 1) * localItemsPerPage.value
  return sortedRows.value.slice(start, start + localItemsPerPage.value)
})
</script>

<template>
  <div>
    <div class="base-table-desktop">
      <component
        :is="tableComponent"
        v-bind="tableProps"
        @update:page="handlePageUpdate"
        @update:sort-by="sortBy = $event"
        @click:row="handleRowClick"
      >
        <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps || {}" /></template>
      </component>
    </div>
    <div class="base-table-mobile">
      <article
        v-for="(item, index) in mobileRows"
        :key="item.id ?? item.key ?? index"
        class="mobile-row-card"
      >
        <button
          v-if="rowClickable"
          type="button"
          class="mobile-row-edit"
          :aria-label="`Open row ${index + 1}`"
          @click="emit('click:row', item)"
        >
          Open row
        </button>
        <div v-for="column in columns" :key="column.key" class="mobile-card-field">
          <span class="mobile-card-label">{{ column.label || column.key }}</span>
          <span class="mobile-card-value">
            <slot
              :name="`item.${column.key}`"
              :item="item"
              :value="item[column.key]"
              :column="column"
            >
              {{ item[column.key] ?? '—' }}
            </slot>
          </span>
        </div>
      </article>
      <div v-if="mobileRows.length === 0" class="mobile-empty">
        <slot name="no-data">No data available</slot>
      </div>
    </div>
    <BasePagination
      v-if="!hideDefaultFooter"
      :model-value="activePage"
      :page-count="pageCount"
      :total="paginationTotal"
      :items-per-page="localItemsPerPage"
      :loading="loading"
      @update:model-value="handlePageUpdate"
      @update:items-per-page="handlePageSizeUpdate"
    />
  </div>
</template>

<style scoped>

:deep(.v-table.v-table--fixed-header > .v-table__wrapper > table > thead > tr > th),
:deep(thead tr th) {
  background: rgb(var(--v-theme-surface-light));
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.table-filter {
  flex: 0 1 320px;
}

.table-filter-note {
  margin: 0;
  color: rgb(var(--v-theme-on-surface), 0.6);
  font-size: 0.75rem;
  text-align: right;
}

.base-table-mobile {
  display: none;
}

.mobile-row-card {
  position: relative;
  margin-bottom: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 10px;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 1px 3px rgb(0 0 0 / 8%);
}

.mobile-row-edit {
  min-height: 44px;
  margin: 0 0 8px;
  padding: 8px 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-primary));
  font: inherit;
  cursor: pointer;
}

.mobile-row-edit:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.mobile-card-field {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.mobile-card-field:first-child {
  .mobile-card-label {
    border-top-left-radius: 10px;
  }
}

.mobile-card-field:last-child {
  border-bottom: 0;

  .mobile-card-label {
    border-bottom-left-radius: 10px;
  }
}

.mobile-card-label {
  flex: 0 0 35%;
  background: rgb(var(--v-theme-surface-light));
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0 16px;
  line-height: 2rem;
}

.mobile-card-value {
  min-width: 0;
  text-align: right;
  overflow-wrap: anywhere;
  padding: 0 16px;
}

.mobile-empty {
  padding: 16px;
  text-align: center;
}

@media (max-width: 600px) {
  .base-table-desktop {
    display: none;
  }

  .base-table-mobile {
    display: block;
  }

  .table-toolbar {
    align-items: stretch;
    flex-direction: column;
    gap: 4px;
  }

  .table-filter {
    flex: 0 0 auto;
    width: 100%;
  }

  .table-filter-note {
    text-align: left;
  }
}
</style>
