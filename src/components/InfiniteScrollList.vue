<template>
  <div
    class="infinite-list"
    :style="{ '--infinite-list-header': `${headerHeight}px` }"
  >
    <Teleport v-if="teleportTo" :to="teleportTo">
      Rendered {{ itemLabel }}: {{ items.length }}
    </Teleport>

    <div ref="scroller" class="infinite-list__scroller" @scroll.passive="onScroll">
      <v-card
        v-for="entry in items"
        :key="entry.key"
        :data-page="entry.page"
        class="infinite-list__item"
        rounded="0"
        flat
      >
        <slot :item="entry.item" :page="entry.page" />
      </v-card>
    </div>

    <template v-if="error">
      <slot name="error" :error="error" :retry="retry">
        <v-alert type="error" variant="tonal" rounded="0" density="compact">
          Failed to load {{ itemLabel }}: {{ error.message }}
          <template #append>
            <v-btn size="small" variant="text" @click="retry">Retry</v-btn>
          </template>
        </v-alert>
      </slot>
    </template>

    <v-progress-linear :active="loading" height="2" indeterminate />

    <v-sheet class="pager border-t">
      <span>{{ total }} {{ itemLabel }}</span>

      <div class="pager__controls">
        <v-btn
          :disabled="page <= 1"
          aria-label="Previous page"
          icon="mdi-chevron-left"
          size="small"
          variant="text"
          @click="goToPage(page - 1)"
        />
        <v-select
          :disabled="!pageCount"
          :items="pageOptions"
          :model-value="page"
          aria-label="Page"
          class="pager__select"
          density="compact"
          hide-details
          variant="outlined"
          @update:model-value="goToPage"
        />
        <span v-if="pageCount">of {{ pageCount }}</span>
        <v-btn
          :disabled="page >= pageCount"
          aria-label="Next page"
          icon="mdi-chevron-right"
          size="small"
          variant="text"
          @click="goToPage(page + 1)"
        />
      </div>
    </v-sheet>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="T extends Record<string, any> = Record<string, any>"
>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    url: string
    pageSize?: number
    itemKey?: string | ((item: T) => string | number)
    dataKey?: string | null
    totalKey?: string
    limitParam?: string
    skipParam?: string
    hashKey?: string | null
    maxLoadedPages?: number
    scrollThreshold?: number
    itemLabel?: string
    teleportTo?: string | null
    headerHeight?: number
  }>(),
  {
    pageSize: 10,
    itemKey: 'id',
    dataKey: null,
    totalKey: 'total',
    limitParam: 'limit',
    skipParam: 'skip',
    hashKey: 'page',
    maxLoadedPages: 3,
    scrollThreshold: 100,
    itemLabel: 'items',
    teleportTo: null,
    headerHeight: 75,
  },
)

const emit = defineEmits<{
  error: [error: Error]
}>()

defineSlots<{
  default(props: { item: T; page: number }): unknown
  error(props: { error: Error; retry: () => void }): unknown
}>()

interface Entry {
  key: string | number
  page: number
  item: T
}

const scroller = ref<HTMLElement | null>(null)
const items = ref([]) as Ref<Entry[]>
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const error = ref<Error | null>(null)

let firstPage = 1
let lastPage = 0
let generation = 0

const pageCount = computed(() => Math.ceil(total.value / props.pageSize))
const pageOptions = computed(() => Array.from({ length: pageCount.value }, (_, i) => i + 1))

async function fetchPage(n: number): Promise<unknown> {
  const url = new URL(props.url, window.location.href)
  url.searchParams.set(props.limitParam, String(props.pageSize))
  url.searchParams.set(props.skipParam, String((n - 1) * props.pageSize))

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function extractRecords(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  const obj = (data ?? {}) as Record<string, unknown>
  if (props.dataKey) return (obj[props.dataKey] as T[] | undefined) ?? []
  return (Object.values(obj).find(Array.isArray) as T[] | undefined) ?? []
}

function keyFor(item: T, pageNumber: number, index: number): string | number {
  const key = typeof props.itemKey === 'function' ? props.itemKey(item) : item?.[props.itemKey]
  return key ?? `${pageNumber}-${index}`
}

const toEntries = (data: unknown, pageNumber: number): Entry[] =>
  extractRecords(data).map((item, index) => ({
    key: keyFor(item, pageNumber, index),
    page: pageNumber,
    item,
  }))

function readTotal(data: unknown): number {
  const value = Number((data as Record<string, unknown> | null)?.[props.totalKey])
  if (!Number.isFinite(value)) {
    throw new Error(`Response has no numeric "${props.totalKey}" property`)
  }
  return value
}

function fail(err: unknown) {
  const normalized = err instanceof Error ? err : new Error(String(err))
  console.error(`Failed to load ${props.itemLabel}:`, normalized)
  error.value = normalized
  emit('error', normalized)
}

function retry() {
  error.value = null
  if (items.value.length) {
    checkEdges()
  } else {
    jumpTo(pageFromHash())
  }
}

function pageFromHash(): number {
  if (!props.hashKey) return 1
  const n = Number(new URLSearchParams(location.hash.slice(1)).get(props.hashKey))
  return Number.isInteger(n) && n >= 1 ? n : 1
}

function updateHash() {
  if (!props.hashKey || !pageCount.value) return
  try {
    const params = new URLSearchParams(location.hash.slice(1))
    params.set(props.hashKey, String(page.value))
    history.replaceState(history.state, '', `#${params}`)
  } catch {
  }
}

function onHashChange() {
  const target = pageFromHash()
  if (target !== page.value) goToPage(target)
}

watch(page, updateHash)

function goToPage(target: number) {
  const el = scroller.value
  if (!el || target < 1 || target > pageCount.value) return

  const tile = el.querySelector<HTMLElement>(`[data-page="${target}"]`)
  if (tile) {
    const offset = tile.getBoundingClientRect().top - el.getBoundingClientRect().top
    page.value = target
    el.scrollTo({ top: el.scrollTop + offset })
  } else {
    jumpTo(target)
  }
}

async function jumpTo(target: number) {
  const gen = ++generation
  loading.value = true
  error.value = null

  try {
    let data = await fetchPage(target)
    if (gen !== generation) return

    total.value = readTotal(data)
    if (total.value && target > pageCount.value) {
      target = pageCount.value
      data = await fetchPage(target)
      if (gen !== generation) return
    }

    page.value = firstPage = lastPage = target
    items.value = toEntries(data, target)
    await nextTick()
    if (scroller.value) scroller.value.scrollTop = 0
  } catch (err) {
    if (gen === generation) fail(err)
  } finally {
    if (gen === generation) {
      loading.value = false
      updateHash()
      await nextTick()
      checkEdges()
    }
  }
}

async function loadNext() {
  const gen = generation
  const target = lastPage + 1
  loading.value = true

  try {
    const data = await fetchPage(target)
    if (gen !== generation) return

    lastPage = target
    items.value.push(...toEntries(data, target))
  } catch (err) {
    if (gen === generation) fail(err)
  } finally {
    if (gen === generation) {
      loading.value = false
      await nextTick()
      checkEdges()
    }
  }
}

async function loadPrevious() {
  const gen = generation
  const target = firstPage - 1
  loading.value = true

  try {
    const data = await fetchPage(target)
    if (gen !== generation) return

    const el = scroller.value
    const heightBefore = el?.scrollHeight ?? 0
    firstPage = target
    items.value.unshift(...toEntries(data, target))
    await nextTick()
    if (el) el.scrollTop += el.scrollHeight - heightBefore
  } catch (err) {
    if (gen === generation) fail(err)
  } finally {
    if (gen === generation) {
      loading.value = false
      await nextTick()
      checkEdges()
    }
  }
}

function checkEdges() {
  const el = scroller.value
  if (loading.value || error.value || !el) return

  const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + props.scrollThreshold
  const nearTop = el.scrollTop < props.scrollThreshold

  if (nearBottom && lastPage < pageCount.value) {
    loadNext()
  } else if (nearTop && firstPage > 1) {
    loadPrevious()
  }

  if (lastPage - firstPage + 1 >= Math.max(props.maxLoadedPages, 2)) {
    if (el.scrollTop < props.scrollThreshold * 2) {
      pruneBottom()
    } else if (el.scrollHeight - el.scrollTop <= el.clientHeight + props.scrollThreshold * 2) {
      pruneTop()
    }
  }
}

async function pruneTop() {
  const el = scroller.value
  if (!el) return
  const heightBefore = el.scrollHeight
  const scrollTopBefore = el.scrollTop

  items.value = items.value.filter(entry => entry.page > firstPage)
  firstPage++

  await nextTick()
  el.scrollTop = scrollTopBefore - (heightBefore - el.scrollHeight)
}

function pruneBottom() {
  items.value = items.value.filter(entry => entry.page < lastPage)
  lastPage--
}

function updateCurrentPage() {
  const el = scroller.value
  if (!el) return
  const top = el.getBoundingClientRect().top

  for (const card of Array.from(el.children) as HTMLElement[]) {
    if (card.getBoundingClientRect().bottom > top + 1) {
      const n = Number(card.dataset.page)
      if (Number.isFinite(n)) page.value = n
      return
    }
  }
}

function onScroll() {
  updateCurrentPage()
  checkEdges()
}

watch(
  () => [props.url, props.pageSize],
  () => {
    items.value = []
    total.value = 0
    firstPage = 1
    lastPage = 0
    jumpTo(1)
  },
)

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  jumpTo(pageFromHash())
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange)
})

defineExpose({ goToPage, retry })
</script>

<style scoped>
.infinite-list {
  display: flex;
  flex-direction: column;
  height: calc(
    100dvh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px) - var(--infinite-list-header, 0px)
  );
}

.infinite-list__scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-anchor: none;
}

.infinite-list__item.v-card {
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.pager__controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pager__select {
  width: 6.5rem;
}
</style>