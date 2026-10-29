<template>
  <div class="products-page">
    <div ref="scroller" class="products-list" @scroll.passive="onScroll">
      <v-card
        v-for="item in items"
        :key="item.product.id"
        :data-page="item.page"
        class="product-card"
        rounded="0"
        flat
      >
        <div class="product-card__media">
          <v-img
            :src="item.product.thumbnail"
            :alt="item.product.title"
            aspect-ratio="1"
          />
        </div>

        <div class="product-card__body">
          <h2 class="text-h6">{{ item.product.title }}</h2>
          <div class="text-body-2 text-medium-emphasis text-capitalize">
            {{ metaFor(item.product) }}
          </div>

          <div class="product-card__price-row">
            <span class="text-h6">{{ currency.format(item.product.price) }}</span>
            <v-chip
              v-if="item.product.discountPercentage"
              size="small"
              color="success"
              variant="tonal"
            >
              {{ Math.round(item.product.discountPercentage) }}% off
            </v-chip>
            <span v-if="item.product.rating" class="product-card__rating">
              <v-rating
                :model-value="item.product.rating"
                color="amber"
                density="compact"
                size="small"
                half-increments
                readonly
              />
              <span class="text-body-2">
                {{ item.product.rating.toFixed(1) }}
                <template v-if="item.product.reviews?.length">
                  ({{ item.product.reviews.length }}
                  {{ item.product.reviews.length === 1 ? 'review' : 'reviews' }})
                </template>
              </span>
            </span>
          </div>

          <p class="text-body-2 mb-0">{{ item.product.description }}</p>

          <div v-if="item.product.tags?.length" class="product-card__tags">
            <v-chip
              v-for="tag in item.product.tags"
              :key="tag"
              size="small"
              variant="outlined"
            >
              {{ tag }}
            </v-chip>
          </div>

          <dl class="product-card__details text-body-2">
            <template v-for="[label, value] in detailsFor(item.product)" :key="label">
              <dt class="text-medium-emphasis">{{ label }}</dt>
              <dd>{{ value }}</dd>
            </template>
          </dl>
        </div>
      </v-card>
    </div>

    <v-progress-linear :active="loading" height="2" indeterminate />

    <v-sheet class="pager border-t">
      <span>{{ total }} items</span>

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
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const API_URL = 'https://dummyjson.com/products'
const PAGE_SIZE = 10
const SCROLL_THRESHOLD = 100 // px from an edge that triggers loading

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const scroller = ref(null)
const items = ref([]) // [{ page, product }]
const page = ref(1) // page at the top of the viewport
const total = ref(0)
const loading = ref(false)

let firstPage = 1 // first page in the DOM
let lastPage = 0 // last page in the DOM
let generation = 0 // bumped on every jump so stale requests are discarded

const pageCount = computed(() => Math.ceil(total.value / PAGE_SIZE))
const pageOptions = computed(() => Array.from({ length: pageCount.value }, (_, i) => i + 1))

// --- Data ------------------------------------------------------------------

async function fetchPage(n) {
  const res = await fetch(`${API_URL}?limit=${PAGE_SIZE}&skip=${(n - 1) * PAGE_SIZE}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

const toItems = (data, pageNumber) =>
  data.products.map(product => ({ page: pageNumber, product }))

function metaFor(product) {
  return [product.brand, product.category?.replace(/-/g, ' ')].filter(Boolean).join(' · ')
}

function detailsFor(product) {
  const { width, height, depth } = product.dimensions ?? {}
  return [
    ['Availability', product.availabilityStatus && `${product.availabilityStatus} (${product.stock} in stock)`],
    ['Shipping', product.shippingInformation],
    ['Warranty', product.warrantyInformation],
    ['Returns', product.returnPolicy],
    ['Min. order', product.minimumOrderQuantity],
    ['Weight', product.weight],
    ['Dimensions', width && `${width} × ${height} × ${depth}`],
    ['SKU', product.sku],
  ].filter(([, value]) => value)
}

// --- URL hash (#page=N) ------------------------------------------------------

function pageFromHash() {
  const n = Number(new URLSearchParams(location.hash.slice(1)).get('page'))
  return Number.isInteger(n) && n >= 1 ? n : 1
}

function updateHash() {
  if (!pageCount.value) return
  try {
    // Pass the existing state through so vue-router's history entry stays intact
    history.replaceState(history.state, '', `#page=${page.value}`)
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

  try {
    let data = await fetchPage(target)
    if (gen !== generation) return

    total.value = data.total
    if (total.value && target > pageCount.value) {
      target = pageCount.value // URL asked for a page past the end
      data = await fetchPage(target)
      if (gen !== generation) return
    }

    page.value = firstPage = lastPage = target
    items.value = toItems(data, target)
    await nextTick()
    scroller.value.scrollTop = 0
  } catch (err) {
    console.error('Failed to load products:', err)
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
    items.value.push(...toItems(data, target))
  } catch (err) {
    console.error('Failed to load products:', err)
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
    items.value.unshift(...toItems(data, target))
    await nextTick()
    el.scrollTop += el.scrollHeight - heightBefore
  } catch (err) {
    console.error('Failed to load products:', err)
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
  if (loading.value || !el) return

  const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + SCROLL_THRESHOLD
  const nearTop = el.scrollTop < SCROLL_THRESHOLD

  if (nearBottom && lastPage < pageCount.value) {
    loadNext()
  } else if (nearTop && firstPage > 1) {
    loadPrevious()
  }
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

onMounted(() => {
  window.addEventListener('hashchange', onHashChange)
  jumpTo(pageFromHash())
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', onHashChange)
})
</script>

<style scoped>
.products-page {
  --v-layout-header: 75px;
  display: flex;
  flex-direction: column;
  /* Fill the space inside <v-main>, minus any app bars / footers */
  height: calc(100dvh - var(--v-layout-top, 0px) - var(--v-layout-bottom, 0px) - var(--v-layout-header, 0px));
}

.products-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* We restore the scroll position ourselves when prepending a page */
  overflow-anchor: none;
}

.product-card.v-card {
  display: grid;
  grid-template-columns: minmax(100px, 35%) 1fr;
  min-height: 300px;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.product-card__media {
  display: flex;
  align-items: center;
  background: rgba(var(--v-theme-on-surface), 0.06);
}

.product-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.75rem;
}

.product-card__price-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
}

.product-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.product-card__details {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.75rem;
  margin: 0;
}

.product-card__details dd {
  margin: 0;
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
