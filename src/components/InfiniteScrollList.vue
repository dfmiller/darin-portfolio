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
        <!-- Render each record however you like -->
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

<script setup>
/**
 * Infinite-scrolling, pageable list for any limit/skip style JSON API.
 *
 * The API must return the records in an array plus a total count, e.g.
 *   { users: [...], total: 208, skip: 0, limit: 10 }
 *
 * Slot props (default slot): { item, page }
 * Error slot props:          { error, retry }
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  /** Endpoint to page through, e.g. https://dummyjson.com/users */
  url: { type: String, required: true },
  pageSize: { type: Number, default: 10 },
  /** Property name, or function(item) => key, used for v-for keys */
  itemKey: { type: [String, Function], default: 'id' },
  /** Response property holding the records. Auto-detected (first array) if omitted */
  dataKey: { type: String, default: null },
  /** Response property holding the total record count */
  totalKey: { type: String, default: 'total' },
  limitParam: { type: String, default: 'limit' },
  skipParam: { type: String, default: 'skip' },
  /** Hash param used to sync the current page (#page=N). Pass null to disable */
  hashKey: { type: String, default: 'page' },
  /** Max pages kept in the DOM at once (minimum 2) */
  maxLoadedPages: { type: Number, default: 3 },
  /** px from an edge that triggers loading */
  scrollThreshold: { type: Number, default: 100 },
  /** Plural noun used in the pager and error text */
  itemLabel: { type: String, default: 'items' },
  /** Optional CSS selector to teleport a "rendered items" counter to */
  teleportTo: { type: String, default: null },
  /** Height (px) of the layout above the list, subtracted from the list height */
  headerHeight: { type: Number, default: 75 },
})

const emit = defineEmits(['error'])

const scroller = ref(null)
const items = ref([]) // [{ key, page, item }]
const page = ref(1) // page at the top of the viewport
const total = ref(0)
const loading = ref(false)
const error = ref(null)

let firstPage = 1 // first page in the DOM
let lastPage = 0 // last page in the DOM
let generation = 0 // bumped on every jump so stale requests are discarded

const pageCount = computed(() => Math.ceil(total.value / props.pageSize))
const pageOptions = computed(() => Array.from({ length: pageCount.value }, (_, i) => i + 1))

// --- Data ------------------------------------------------------------------

async function fetchPage(n) {
  // Resolve against the current location so relative URLs work, and keep any
  // existing query string (e.g. /users/search?q=john)
  const url = new URL(props.url, window.location.href)
  url.searchParams.set(props.limitParam, props.pageSize)
  url.searchParams.set(props.skipParam, (n - 1) * props.pageSize)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

function extractRecords(data) {
  if (Array.isArray(data)) return data
  if (props.dataKey) return data?.[props.dataKey] ?? []
  return Object.values(data ?? {}).find(Array.isArray) ?? []
}

function keyFor(item, pageNumber, index) {
  const key = typeof props.itemKey === 'function' ? props.itemKey(item) : item?.[props.itemKey]
  return key ?? `${pageNumber}-${index}`
}

const toEntries = (data, pageNumber) =>
  extractRecords(data).map((item, index) => ({
    key: keyFor(item, pageNumber, index),
    page: pageNumber,
    item,
  }))

function readTotal(data) {
  const value = Number(data?.[props.totalKey])
  if (!Number.isFinite(value)) {
    throw new Error(`Response has no numeric "${props.totalKey}" property`)
  }
  return value
}

function fail(err) {
  console.error(`Failed to load ${props.itemLabel}:`, err)
  error.value = err
  emit('error', err)
}

function retry() {
  error.value = null
  if (items.value.length) {
    checkEdges()
  } else {
    jumpTo(pageFromHash())
  }
}

// --- URL hash (#page=N) ------------------------------------------------------

function pageFromHash() {
  if (!props.hashKey) return 1
  const n = Number(new URLSearchParams(location.hash.slice(1)).get(props.hashKey))
  return Number.isInteger(n) && n >= 1 ? n : 1
}

function updateHash() {
  if (!props.hashKey || !pageCount.value) return
  try {
    const params = new URLSearchParams(location.hash.slice(1))
    params.set(props.hashKey, page.value)
    // Pass the existing state through so vue-router's history entry stays intact
    history.replaceState(history.state, '', `#${params}`)
  } catch {
    // History API unavailable (e.g. sandboxed frame); the hash is optional
  }
}

function onHashChange() {
  const target = pageFromHash()
  if (target !== page.value) goToPage(target)
}

watch(page, updateHash)

// --- Navigation --------------------------------------------------------------

// Scroll to a page if it's already loaded, otherwise restart the list there.
function goToPage(target) {
  if (target < 1 || target > pageCount.value) return

  const el = scroller.value
  const tile = el.querySelector(`[data-page="${target}"]`)
  if (tile) {
    const offset = tile.getBoundingClientRect().top - el.getBoundingClientRect().top
    page.value = target
    el.scrollTo({ top: el.scrollTop + offset })
  } else {
    jumpTo(target)
  }
}

// --- Loading ---------------------------------------------------------------

async function jumpTo(target) {
  const gen = ++generation
  loading.value = true
  error.value = null

  try {
    let data = await fetchPage(target)
    if (gen !== generation) return

    total.value = readTotal(data)
    if (total.value && target > pageCount.value) {
      target = pageCount.value // URL asked for a page past the end
      data = await fetchPage(target)
      if (gen !== generation) return
    }

    page.value = firstPage = lastPage = target
    items.value = toEntries(data, target)
    await nextTick()
    scroller.value.scrollTop = 0
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

    // Keep what the user is looking at in place while content is added above it
    const el = scroller.value
    const heightBefore = el.scrollHeight
    firstPage = target
    items.value.unshift(...toEntries(data, target))
    await nextTick()
    el.scrollTop += el.scrollHeight - heightBefore
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
  // Stop while an error is showing so a failing endpoint isn't hammered in a loop
  if (loading.value || error.value || !el) return

  const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + props.scrollThreshold
  const nearTop = el.scrollTop < props.scrollThreshold

  if (nearBottom && lastPage < pageCount.value) {
    loadNext()
  } else if (nearTop && firstPage > 1) {
    loadPrevious()
  }

  // Too many pages in the DOM: trim from the edge the user is moving away from
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
  const heightBefore = el.scrollHeight
  const scrollTopBefore = el.scrollTop

  items.value = items.value.filter(entry => entry.page > firstPage)
  firstPage++

  await nextTick()
  // Adjust scroll position so content doesn't jump
  el.scrollTop = scrollTopBefore - (heightBefore - el.scrollHeight)
}

function pruneBottom() {
  items.value = items.value.filter(entry => entry.page < lastPage)
  lastPage--
}

// The current page is the page of the card at the top of the viewport.
function updateCurrentPage() {
  const el = scroller.value
  const top = el.getBoundingClientRect().top

  for (const card of el.children) {
    if (card.getBoundingClientRect().bottom > top + 1) {
      page.value = Number(card.dataset.page)
      return
    }
  }
}

function onScroll() {
  updateCurrentPage()
  checkEdges()
}

// --- Lifecycle -------------------------------------------------------------

// A different endpoint (or page size) means a different data set: start over.
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
  /* Fill the space inside <v-main>, minus any app bars / footers */
  height: calc(
    100dvh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px) - var(--infinite-list-header, 0px)
  );
}

.infinite-list__scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* We restore the scroll position ourselves when prepending a page */
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