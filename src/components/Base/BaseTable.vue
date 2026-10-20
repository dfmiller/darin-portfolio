<script setup>
// columns: [{ key, label }] replaces Vuetify's headers shape. Search is built in.
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
const emit = defineEmits(['update:page'])
const q = ref('')
const headers = computed(() => props.columns.map(c => ({ title: c.label, key: c.key })))
const tableComponent = computed(() => props.serverItemsLength === undefined ? 'v-data-table' : 'v-data-table-server')
const tableProps = computed(() => ({
  headers: headers.value,
  items: props.rows,
  search: q.value,
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
    <v-text-field v-if="searchable" v-model="q" placeholder="Filter rows" prepend-inner-icon="mdi-magnify" hide-details class="mb-3" style="max-width:320px" />
    <component :is="tableComponent" v-bind="tableProps" @update:page="emit('update:page', $event)">
      <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps || {}" /></template>
    </component>
  </div>
</template>
