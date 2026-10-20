<template>
  <div class="comments-table" :class="{ full }">
    <h1>Users</h1>
    <p class="src">
      Data from
      <a href="https://jsonfakery.com/users/paginated">jsonfakery.com/users/paginated</a>
    </p>

    <div class="tablebox">
      <div
        ref="wrap"
        class="wrap"
        :class="{ locked: scrollLocked }"
        @scroll="handleScroll"
        @wheel="handleWheel"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
        @touchcancel.passive="handleTouchCancel"
      >
        <table>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in currentRows" :key="row.id">
              <td
                v-for="column in columns"
                :key="column.key"
                :class="[
                  column.className,
                  {
                    editable: column.edit,
                    edited: column.edit && isEdited(row.id, column.key),
                  },
                ]"
                @click="column.edit && openEditor(row, column)"
              >
                <template v-if="column.key === 'n'">
                  {{ currentStart + index + 1 }}
                </template>
                <img
                  v-else-if="column.key === 'photo' && row.photo.startsWith('https://')"
                  class="avatar"
                  :src="row.photo"
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                />
                <template v-else-if="column.key !== 'photo'">
                  {{ display(row, column.key) }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        type="button"
        class="fs-btn"
        :title="full ? 'Exit full page' : 'Full page'"
        :aria-label="full ? 'Exit full page' : 'Full page'"
        :aria-pressed="full"
        @click="full = !full"
      >
        <svg v-if="full" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 1v3H1M9 4H6V1M6 9V6h3M1 6h3v3" />
        </svg>
        <svg v-else viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M1 4V1h3M6 1h3v3M9 6v3H6M4 9H1V6" />
        </svg>
      </button>
    </div>

    <div class="footer">
      <div class="info" aria-live="polite">
        {{ statusText }}
      </div>
      <div class="pager" aria-label="Pagination">
        <button
          type="button"
          title="First page"
          aria-label="First page"
          :disabled="busy || page === 1"
          @click="goTo(1)"
        >
          «
        </button>
        <button
          type="button"
          title="Previous page"
          aria-label="Previous page"
          :disabled="busy || page === 1"
          @click="goTo(page - 1)"
        >
          ‹
        </button>
        <select
          title="Go to page"
          aria-label="Current page"
          :value="page"
          :disabled="busy"
          @change="handlePageSelect"
        >
          <option v-for="pageNumber in pageNumbers" :key="pageNumber" :value="pageNumber">
            {{ pageNumber }}
          </option>
        </select>
        <button
          type="button"
          title="Next page"
          aria-label="Next page"
          :disabled="busy || page === pageCount"
          @click="goTo(page + 1)"
        >
          ›
        </button>
        <button
          type="button"
          title="Last page"
          aria-label="Last page"
          :disabled="busy || page === pageCount"
          @click="goTo(pageCount)"
        >
          »
        </button>
      </div>
    </div>

    <dialog ref="editorDialog" class="editor" @close="closeEditor" @click.self="closeDialog">
      <form novalidate @submit.prevent="saveEdit">
        <h2>{{ editing ? `Edit ${editing.row.name || 'user'}` : '' }}</h2>
        <label v-if="editing" for="editor-input">{{ editing.column.label }}</label>
        <div v-if="editing">
          <textarea
            v-if="editing.column.edit?.type === 'textarea'"
            id="editor-input"
            ref="editorInput"
            v-model="editorValue"
            :required="!editing.column.edit.optional"
          />
          <input
            v-else
            id="editor-input"
            ref="editorInput"
            v-model="editorValue"
            :type="editing.column.edit?.type ?? 'text'"
            :required="!editing.column.edit?.optional"
          />
        </div>
        <p class="err" role="alert">{{ editError }}</p>
        <div class="actions">
          <button type="button" @click="closeDialog">Cancel</button>
          <button type="submit" class="primary">Save</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const API = 'https://jsonfakery.com/users/paginated'
const LOCK_MS = 1000
const SWIPE_DISTANCE = 60

type EditableField =
  | 'name'
  | 'username'
  | 'email'
  | 'role'
  | 'country'
  | 'created'
  | 'verified'
type ColumnKey = EditableField | 'n' | 'photo' | 'id'
type EditType = 'text' | 'email' | 'date' | 'textarea'

interface UserRow {
  id: string
  photo: string
  name: string
  username: string
  email: string
  role: string
  country: string
  created: string
  verified: string
}

interface Column {
  key: ColumnKey
  label: string
  className: string
  edit?: {
    type: EditType
    optional?: boolean
  }
}

interface CachedPage {
  rows: UserRow[]
  from: number
}

interface ApiPage {
  data: Record<string, unknown>[]
  total?: number
  last_page?: number
  from?: number
  per_page?: number
}

const columns = [
  { key: 'n', label: '#', className: 'nw' },
  { key: 'photo', label: 'Photo', className: 'nw' },
  { key: 'name', label: 'Name', className: 'name', edit: { type: 'text' } },
  { key: 'username', label: 'Username', className: 'nw', edit: { type: 'text' } },
  { key: 'email', label: 'Email', className: 'nw', edit: { type: 'email' } },
  { key: 'role', label: 'Role', className: 'nw', edit: { type: 'text' } },
  { key: 'country', label: 'Country', className: 'nw', edit: { type: 'text', optional: true } },
  { key: 'created', label: 'Created', className: 'nw', edit: { type: 'date' } },
  { key: 'verified', label: 'Verified', className: 'nw', edit: { type: 'date', optional: true } },
  { key: 'id', label: 'ID', className: 'nw mono' },
] satisfies readonly Column[]

const dateKeys = new Set<EditableField>(['created', 'verified'])
const cache = ref<Record<number, CachedPage>>({})
const edits = ref<Record<string, Partial<Record<EditableField, string>>>>({})
const total = ref<number | null>(null)
const pageCount = ref(1)
const page = ref(1)
const busy = ref(false)
const pendingPage = ref<number | null>(null)
const loadError = ref('')
const full = ref(false)
const wrap = ref<HTMLDivElement | null>(null)
const editorDialog = ref<HTMLDialogElement | null>(null)
const editorInput = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)
const editorValue = ref('')
const editError = ref('')
const scrollLocked = ref(false)

const currentPage = computed(() => cache.value[page.value])
const currentRows = computed(() => currentPage.value?.rows ?? [])
const currentStart = computed(() => (currentPage.value?.from ?? 1) - 1)
const pageNumbers = computed(() => Array.from({ length: pageCount.value }, (_, index) => index + 1))
const statusText = computed(() => {
  if (busy.value) return `Loading page ${pendingPage.value}…`
  const status = total.value === null
    ? ''
    : `Page ${page.value} of ${pageCount.value} · ${total.value} users`
  return `${status}${loadError.value ? ` — ${loadError.value}` : ''}`
})

let lockedUntil = 0
let lockTimer: number | undefined
let lockPosition: number | null = null
let shownPage: number | null = null
let touchStartY: number | null = null
let touchStartX = 0
let startAtTop = false
let startAtBottom = false
let destroyed = false

interface EditingCell {
  row: UserRow
  column: Column & { key: EditableField; edit: NonNullable<Column['edit']> }
}

const editing = ref<EditingCell | null>(null)

function stringValue(value: unknown): string {
  return value == null ? '' : String(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function finiteNumber(value: unknown): number | undefined {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : undefined
}

function toISODate(value: unknown): string {
  if (!value) return ''
  const string = String(value)
  const match = string.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (match) {
    return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
  }
  const timestamp = Date.parse(string)
  return Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return iso
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
    .toLocaleDateString('en-US', {
      weekday: 'short',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    })
}

function display(row: UserRow, key: ColumnKey): string {
  if (key === 'n' || key === 'photo') return ''
  return dateKeys.has(key as EditableField)
    ? formatDate(row[key])
    : row[key]
}

function normalizeUser(user: Record<string, unknown>): UserRow {
  const address = isRecord(user.address) ? user.address : {}
  const name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .map(stringValue)
    .join(' ')

  return {
    id: stringValue(user.id),
    photo: stringValue(user.profile_pic),
    name,
    username: stringValue(user.username),
    email: stringValue(user.email),
    role: stringValue(user.role),
    country: stringValue(address.country),
    created: toISODate(user.created_at),
    verified: toISODate(user.email_verified_at),
  }
}

function isEdited(id: string, key: ColumnKey): boolean {
  return key in (edits.value[id] ?? {})
}

function isLocked(): boolean {
  return Date.now() < lockedUntil
}

function lockScroll(): void {
  const element = wrap.value
  if (!element) return

  lockedUntil = Date.now() + LOCK_MS
  lockPosition = null
  scrollLocked.value = true
  if (lockTimer !== undefined) window.clearTimeout(lockTimer)
  lockTimer = window.setTimeout(() => {
    scrollLocked.value = false
    lockPosition = null
    lockTimer = undefined
  }, LOCK_MS)
}

function jumpTo(position: number): void {
  const element = wrap.value
  if (!element) return
  element.scrollTop = position
  lockPosition = element.scrollTop
}

function handleScroll(): void {
  const element = wrap.value
  if (isLocked() && lockPosition !== null && element && element.scrollTop !== lockPosition) {
    element.scrollTop = lockPosition
  }
}

function edges(): { top: boolean; bottom: boolean } {
  const element = wrap.value
  return {
    top: !element || element.scrollTop <= 0,
    bottom: !element || element.scrollTop + element.clientHeight >= element.scrollHeight - 1,
  }
}

function handleWheel(event: WheelEvent): void {
  const element = wrap.value
  if (!element) return
  if (isLocked()) {
    event.preventDefault()
    return
  }
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return

  const atEdge = edges()
  if (event.deltaY > 0 && atEdge.bottom && page.value < pageCount.value) {
    event.preventDefault()
    void goTo(page.value + 1, 'top')
  } else if (event.deltaY < 0 && atEdge.top && page.value > 1) {
    event.preventDefault()
    void goTo(page.value - 1, 'bottom')
  }
}

function handleTouchStart(event: TouchEvent): void {
  if (event.touches.length !== 1) {
    touchStartY = null
    return
  }
  touchStartY = event.touches[0].clientY
  touchStartX = event.touches[0].clientX
  const atEdge = edges()
  startAtTop = atEdge.top
  startAtBottom = atEdge.bottom
}

function handleTouchEnd(event: TouchEvent): void {
  if (touchStartY === null || event.changedTouches.length === 0) return
  const touch = event.changedTouches[0]
  const deltaY = touch.clientY - touchStartY
  const deltaX = touch.clientX - touchStartX
  touchStartY = null
  if (Math.abs(deltaY) < SWIPE_DISTANCE || Math.abs(deltaX) > Math.abs(deltaY)) return

  const atEdge = edges()
  if (isLocked()) return
  if (deltaY < 0 && startAtBottom && atEdge.bottom && page.value < pageCount.value) {
    void goTo(page.value + 1, 'top')
  } else if (deltaY > 0 && startAtTop && atEdge.top && page.value > 1) {
    void goTo(page.value - 1, 'bottom')
  }
}

function handleTouchCancel(): void {
  touchStartY = null
}

function handlePageSelect(event: Event): void {
  const select = event.currentTarget
  if (select instanceof HTMLSelectElement) void goTo(Number(select.value))
}

function openEditor(row: UserRow, column: Column): void {
  if (!column.edit || !isEditableField(column.key) || !editorDialog.value) return
  editing.value = {
    row,
    column: column as EditingCell['column'],
  }
  editorValue.value = row[column.key]
  editError.value = ''
  editorDialog.value.showModal()
  void nextTick(() => {
    editorInput.value?.focus()
    if (column.edit?.type !== 'date' && column.edit?.type !== 'textarea') {
      editorInput.value?.select()
    }
  })
}

function isEditableField(key: ColumnKey): key is EditableField {
  return key !== 'n' && key !== 'photo' && key !== 'id'
}

function saveEdit(): void {
  const current = editing.value
  const input = editorInput.value
  if (!current || !input) return
  if (!input.checkValidity()) {
    editError.value = input.validationMessage
    input.reportValidity()
    return
  }

  if (editorValue.value !== current.row[current.column.key]) {
    current.row[current.column.key] = editorValue.value
    edits.value[current.row.id] = {
      ...edits.value[current.row.id],
      [current.column.key]: editorValue.value,
    }
  }
  editorDialog.value?.close()
}

function closeDialog(): void {
  editorDialog.value?.close()
}

function closeEditor(): void {
  editing.value = null
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && full.value && !editorDialog.value?.open) {
    full.value = false
  }
}

async function fetchPage(pageNumber: number): Promise<ApiPage> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch(`${API}?page=${pageNumber}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result: unknown = await response.json()
      if (!isRecord(result) || !Array.isArray(result.data) || !result.data.every(isRecord)) {
        throw new Error('Unexpected response')
      }
      return {
        data: result.data,
        total: finiteNumber(result.total),
        last_page: finiteNumber(result.last_page),
        from: finiteNumber(result.from),
        per_page: finiteNumber(result.per_page),
      }
    } catch (error) {
      if (attempt >= 2) throw error
      await new Promise<void>((resolve) => window.setTimeout(resolve, 600))
    }
  }
}

async function goTo(target: number, edge: 'top' | 'bottom' = 'top'): Promise<void> {
  if (busy.value) return
  const targetPage = Math.min(Math.max(1, target), pageCount.value)
  if (!cache.value[targetPage]) {
    busy.value = true
    pendingPage.value = targetPage
    loadError.value = ''
    try {
      const result = await fetchPage(targetPage)
      total.value = result.total ?? total.value ?? result.data.length
      pageCount.value = result.last_page || pageCount.value
      const rows = result.data.map(normalizeUser)
      cache.value[targetPage] = {
        rows,
        from: result.from ?? ((targetPage - 1) * (result.per_page || 10) + 1),
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      loadError.value = `couldn't load page ${targetPage} (${message})`
    } finally {
      busy.value = false
      pendingPage.value = null
    }
    if (!cache.value[targetPage]) return
  } else if (targetPage === page.value && shownPage !== null) {
    return
  }

  if (shownPage !== null && targetPage !== page.value) lockScroll()
  page.value = targetPage
  shownPage = targetPage
  await nextTick()
  if (destroyed) return
  const element = wrap.value
  jumpTo(edge === 'bottom' && element ? element.scrollHeight : 0)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  void goTo(1)
})

onBeforeUnmount(() => {
  destroyed = true
  window.removeEventListener('keydown', handleKeydown)
  if (lockTimer !== undefined) window.clearTimeout(lockTimer)
  if (editorDialog.value?.open) editorDialog.value.close()
})
</script>

<style scoped>
.comments-table {
  --head: 38px;
  --idw: 56px;
  position: relative;
  color: #1f2430;
  font-family: system-ui, sans-serif;
}

.comments-table h1 {
  margin: 0 0 4px;
  font-size: 1.4rem;
  line-height: 1.3;
}

.src {
  margin: 0 0 12px;
  color: #5b6272;
  font-size: 0.85rem;
}

.wrap {
  container-type: size;
  height: 70vh;
  height: 70dvh;
  max-height: 70vh;
  overflow: scroll;
  overscroll-behavior: contain;
  overflow-anchor: none;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  scrollbar-color: #8a92a6 #e6e8ee;
}

.wrap::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

.wrap::-webkit-scrollbar-track {
  background: #e6e8ee;
}

.wrap::-webkit-scrollbar-thumb {
  border: 3px solid #e6e8ee;
  border-radius: 7px;
  background: #8a92a6;
}

.wrap::-webkit-scrollbar-corner {
  background: #e6e8ee;
}

.wrap.locked {
  touch-action: none;
}

thead th {
  position: sticky;
  z-index: 1;
  top: 0;
  box-sizing: border-box;
  height: var(--head);
}

th:first-child,
td:first-child {
  position: sticky;
  left: 0;
  box-sizing: border-box;
  width: var(--idw);
  min-width: var(--idw);
  max-width: var(--idw);
  border-right: 1px solid #e6e8ee;
}

td:first-child,
tr:hover td:first-child {
  z-index: 1;
  background: #eef0f5;
}

thead th:first-child {
  z-index: 2;
}

table {
  width: 100%;
  min-width: 1800px;
  border-collapse: collapse;
}

th,
td {
  padding: 10px 14px;
  border-bottom: 1px solid #e6e8ee;
  text-align: left;
  vertical-align: top;
}

th {
  background: #eef0f5;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

td.nw {
  white-space: nowrap;
}

td.name {
  max-width: 260px;
}

td.mono {
  color: #4a5160;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8rem;
}

img.avatar {
  display: block;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e6e8ee;
  object-fit: cover;
}

tr:hover td {
  background: #fafbfd;
}

.tablebox {
  position: relative;
}

.comments-table.full {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 8px;
  overflow: hidden;
  background: #f5f6f8;
}

.full h1,
.full .src {
  display: none;
}

.full .tablebox {
  flex: 1;
  min-height: 0;
}

.full .wrap {
  position: absolute;
  inset: 0;
  height: auto;
  max-height: none;
}

.full .footer {
  margin-top: 8px;
}

.fs-btn {
  position: absolute;
  z-index: 5;
  right: 0;
  bottom: 0;
  display: flex;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0 0 10px;
  background: #8a92a6;
  color: #fff;
  cursor: pointer;
}

.fs-btn:hover,
.fs-btn:focus-visible {
  outline: none;
  background: #2f5bea;
}

.fs-btn::before {
  position: absolute;
  inset: -10px 0 0 -10px;
  content: '';
}

.fs-btn svg {
  width: 10px;
  height: 10px;
  pointer-events: none;
}

@property --st {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

@property --sb {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

@property --sl {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

@property --sr {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}

@keyframes edge-top {
  from { --st: 0; }
  to { --st: 1; }
}

@keyframes edge-bottom {
  from { --sb: 1; }
  to { --sb: 0; }
}

@keyframes edge-left {
  from { --sl: 0; }
  to { --sl: 1; }
}

@keyframes edge-right {
  from { --sr: 1; }
  to { --sr: 0; }
}

@supports (animation-timeline: scroll()) {
  .wrap::before {
    position: sticky;
    z-index: 4;
    top: 0;
    left: 0;
    display: block;
    width: 100cqw;
    height: 100cqh;
    margin-bottom: -100cqh;
    pointer-events: none;
    background:
      radial-gradient(farthest-side at 50% 0, rgb(31 36 48 / calc(var(--st) * 0.22)), transparent) var(--idw) var(--head) / calc(100% - var(--idw)) 16px no-repeat,
      radial-gradient(farthest-side at 50% 100%, rgb(31 36 48 / calc(var(--sb) * 0.22)), transparent) var(--idw) 100% / calc(100% - var(--idw)) 16px no-repeat,
      radial-gradient(farthest-side at 0 50%, rgb(31 36 48 / calc(var(--sl) * 0.22)), transparent) var(--idw) var(--head) / 16px calc(100% - var(--head)) no-repeat,
      radial-gradient(farthest-side at 100% 50%, rgb(31 36 48 / calc(var(--sr) * 0.22)), transparent) 100% var(--head) / 16px calc(100% - var(--head)) no-repeat;
    animation-name: edge-top, edge-bottom, edge-left, edge-right;
    animation-duration: 1ms;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(nearest y), scroll(nearest y), scroll(nearest x), scroll(nearest x);
    animation-range: 0 40px, calc(100% - 40px) 100%, 0 40px, calc(100% - 40px) 100%;
    content: '';
  }
}

td.editable {
  cursor: text;
}

dialog.editor {
  width: min(480px, calc(100vw - 32px));
  padding: 0;
  border: 0;
  border-radius: 12px;
  color: #1f2430;
  box-shadow: 0 10px 40px rgb(0 0 0 / 30%);
}

dialog.editor::backdrop {
  background: rgb(20 24 36 / 50%);
}

dialog.editor form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 18px;
}

dialog.editor h2 {
  margin: 0;
  font-size: 1.05rem;
}

dialog.editor label {
  color: #5b6272;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

dialog.editor input,
dialog.editor textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  border: 1px solid #cfd3dd;
  border-radius: 8px;
  font: inherit;
  font-size: 1rem;
}

dialog.editor input:focus,
dialog.editor textarea:focus {
  border-color: transparent;
  outline: 2px solid #2f5bea;
}

dialog.editor textarea {
  min-height: 140px;
  resize: vertical;
}

dialog.editor .err {
  min-height: 1em;
  margin: 0;
  color: #c62828;
  font-size: 0.85rem;
}

dialog.editor .actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

dialog.editor button {
  padding: 8px 16px;
  border: 1px solid #cfd3dd;
  border-radius: 6px;
  background: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

dialog.editor button.primary {
  border-color: #2f5bea;
  background: #2f5bea;
  color: #fff;
}

td.edited::after {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 50%;
  background: #2f5bea;
  vertical-align: middle;
  content: '';
}

.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
}

.pager {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pager button {
  padding: 6px 12px;
  border: 1px solid #cfd3dd;
  border-radius: 6px;
  background: #fff;
  font-size: 0.9rem;
  cursor: pointer;
}

.pager button:disabled {
  opacity: 0.45;
  cursor: default;
}

.pager select {
  padding: 6px 8px;
  border: 1px solid #2f5bea;
  border-radius: 6px;
  background: #2f5bea;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
}

.info {
  color: #5b6272;
  font-size: 0.9rem;
}
</style>
