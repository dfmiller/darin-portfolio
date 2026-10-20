<script setup>
// columns: [{ key, label }] replaces Vuetify's headers shape.
import { ref, computed } from 'vue'
const props = defineProps({
  columns: Array,
  rows: Array,
  searchable: { type: Boolean, default: true },
  itemsPerPage: { type: Number, default: 10 },
  page: { type: Number, default: 1 },
  serverItemsLength: Number,
  loading: Boolean,
  hideDefaultFooter: Boolean,
  fixedHeader: Boolean,
  height: [Number, String],
})
const emit = defineEmits(['update:page', 'click:row'])
const q = ref('')
const sortBy = ref([])
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const headers = computed(() => props.columns.map(c => ({
  title: c.label,
  key: c.key,
  sortable: c.sortable ?? c.key !== 'actions',
})))
const tableComponent = computed(() => props.serverItemsLength === undefined ? 'v-data-table' : 'v-data-table-server')
const handleRowClick = (_event, { item }) => emit('click:row', item)
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
const tableProps = computed(() => ({
  headers: headers.value,
  items: sortedRows.value,
  sortBy: sortBy.value,
  density: 'comfortable',
  itemsPerPage: props.itemsPerPage,
  hideDefaultFooter: props.hideDefaultFooter,
  fixedHeader: props.fixedHeader,
  height: props.height,
  ...(props.serverItemsLength === undefined
    ? {}
    : {
        itemsLength: props.serverItemsLength,
        page: props.page,
        loading: props.loading,
      }),
}))
</script>

<template>
  <div>
    <div v-if="searchable" class="table-toolbar">
      <v-text-field
        v-model="q"
        placeholder="Filter rows"
        prepend-inner-icon="mdi-magnify"
        variant="underlined"
        hide-details
        class="table-filter"
      />
      <p v-if="serverItemsLength !== undefined" class="table-filter-note">
        * Filtering and sorting apply to this page only due to lack of backend support.
      </p>
    </div>
    <component
      :is="tableComponent"
      v-bind="tableProps"
      @update:page="emit('update:page', $event)"
      @update:sort-by="sortBy = $event"
      @click:row="handleRowClick"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps || {}" /></template>
    </component>
  </div>
</template>

<style scoped>
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

@media (max-width: 600px) {
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
