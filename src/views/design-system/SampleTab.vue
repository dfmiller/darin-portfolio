<template>
  <div class="comments-table" :class="{ full }">
    <h1>Users</h1>

    <p>This shows reusable components in use for searching, adding, editing, and removing users.</p>
    <p>Changes made here—including additions, edits, and deletions—are local to this table and are not saved to the source API.</p>

    <div class="table-toolbar">
      <v-text-field
          v-model="filterQuery"
          aria-label="Filter users on this page"
          placeholder="Filter this page"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          class="table-filter"
        />
      <BaseButton :disabled="busy" @click="openForm()">Add User</BaseButton>
    </div>

    <div class="mb-4">
      <small>* Filtering and sorting apply to this page of data only, due to lack of backend support.</small>
    </div>

    <div class="tablebox">
      <div class="wrap">

        <table>
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
              <th class="delete-action"><span class="visually-hidden">Delete row</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!busy && currentRows.length === 0">
              <td :colspan="columns.length + 1" class="empty-state">
                No users yet. Use Add User to create the first one.
              </td>
            </tr>
            <tr v-else-if="!busy && filteredRows.length === 0">
              <td :colspan="columns.length + 1" class="empty-state">
                No users match this filter.
              </td>
            </tr>
            <tr
              v-for="entry in filteredRows"
              :key="entry.row.id"
              class="user-row"
              tabindex="0"
              @click="openForm(entry.row)"
              @keydown.enter.prevent="openForm(entry.row)"
            >
              <td
                v-for="column in columns"
                :key="column.key"
                :class="column.className"
              >
                <template v-if="column.key === 'n'">
                  {{ currentStart + entry.index + 1 }}
                </template>
                <img
                  v-else-if="column.key === 'photo' && entry.row.photo.startsWith('https://')"
                  class="avatar"
                  :src="entry.row.photo"
                  alt=""
                  width="28"
                  height="28"
                  loading="lazy"
                />
                <template v-else-if="column.key !== 'photo'">
                  {{ display(entry.row, column.key) }}
                </template>
              </td>
              <td class="delete-action">
                <BaseIconButton
                  icon="mdi-delete-outline"
                  :label="`Delete ${entry.row.name}`"
                  danger
                  @click.stop="requestDelete(entry.row)"
                  @keydown.stop
                />
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
      <div v-if="statusText" class="info" aria-live="polite">{{ statusText }}</div>
      <BasePagination
        v-if="currentRows.length > 0"
        :model-value="page"
        :page-count="pageCount"
        :total="total ?? currentRows.length"
        :items-per-page="itemsPerPage"
        :loading="busy"
        @update:model-value="goTo"
        @update:items-per-page="changeItemsPerPage"
      />
    </div>

    <v-divider class="my-8" />

    <div class="table-actions">
      <BaseButton variant="quiet" :disabled="busy" @click="clearTable">Clear Table</BaseButton>
      <div class="src">
        Data from <a href="https://jsonfakery.com/users/paginated">jsonfakery.com/users/paginated</a>
        &nbsp;
        <BaseButton :loading="busy" :disabled="busy" @click="loadTestData">Load Test Data</BaseButton>
      </div>
    </div>

    <BaseDialog
      v-model="formDialog"
      :title="form.id ? 'Edit User' : 'Add User'"
      confirm-label="Save Changes"
      :confirm-loading="saving"
      max-width="560"
      @confirm="save"
    >
      <div class="user-form-fields">
        <p class="form-note">New and edited users are local to this table; the source API is read-only.</p>
        <BaseTextField v-model="form.name" label="Full name" :error="errors.name" />
        <BaseTextField v-model="form.email" label="Work email" hint="Used for sign-in" :error="errors.email" />
        <BaseTextarea v-model="form.bio" label="Bio" />
        <BaseCombobox v-model="form.role" label="Role" :options="roles" :error="errors.role" />
        <BaseTextField v-model="form.country" label="Country" />
        <BaseDateField v-model="form.created" label="Created" />
        <BaseRadioGroup v-model="form.contact" label="Preferred contact" :options="contacts" />
        <BaseCheckbox v-model="form.notify" label="Send email notifications" />
        <BaseSwitch v-model="isVerified" label="Verified" />
        <BaseFileInput v-model="form.avatar" label="Profile photo" accept="image/*" class="mt-4" />
        <BaseTextField :model-value="form.id ?? 'Assigned on save'" label="ID" disabled />
      </div>
    </BaseDialog>

    <BaseDialog
      :model-value="!!rowToDelete"
      title="Delete this user?"
      confirm-label="Delete"
      danger
      @update:model-value="rowToDelete = null"
      @confirm="deleteRow"
    >
      This only removes {{ rowToDelete?.name }} from the local table. The source API is not changed.
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import BaseDialog from '../../components/Base/BaseDialog.vue'

const API = 'https://jsonfakery.com/users/paginated'
const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]
const contacts = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'none', label: "Don't contact" },
]
type ColumnKey = 'n' | 'photo' | 'name' | 'email' | 'role' | 'country' | 'created' | 'verified' | 'id'

interface UserRow {
  id: string
  photo: string
  name: string
  email: string
  bio: string
  role: string
  country: string
  created: string
  verified: string
  contact: string
  notify: boolean
  avatar: File | File[] | null
}

interface UserForm {
  id: string | null
  photo: string
  name: string
  email: string
  bio: string
  role: string
  country: string
  created: string
  verified: string
  contact: string
  notify: boolean
  avatar: File | File[] | null
}

interface Column {
  key: ColumnKey
  label: string
  className: string
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
  { key: 'name', label: 'Name', className: 'name' },
  { key: 'email', label: 'Email', className: 'nw' },
  { key: 'role', label: 'Role', className: 'nw' },
  { key: 'country', label: 'Country', className: 'nw' },
  { key: 'created', label: 'Created', className: 'nw' },
  { key: 'verified', label: 'Verified', className: 'nw' },
  { key: 'id', label: 'ID', className: 'nw mono' },
] satisfies readonly Column[]

const dateKeys = new Set<ColumnKey>(['created', 'verified'])
const cache = ref<Record<number, CachedPage>>({})
const total = ref<number | null>(null)
const pageCount = ref(1)
const page = ref(1)
const busy = ref(false)
const pendingPage = ref<number | null>(null)
const loadError = ref('')
const filterQuery = ref('')
const full = ref(false)
const formDialog = ref(false)
const saving = ref(false)
const rowToDelete = ref<UserRow | null>(null)
const form = reactive<UserForm>(blankUser())
const errors = reactive({ name: '', email: '', role: '' })
const isVerified = computed({
  get: () => Boolean(form.verified),
  set: (value: boolean) => {
    if (!value) {
      form.verified = ''
      return
    }

    if (!form.verified) {
      const today = new Date()
      form.verified = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    }
  },
})

const currentPage = computed(() => cache.value[page.value])
const currentRows = computed(() => currentPage.value?.rows ?? [])
const currentStart = computed(() => (currentPage.value?.from ?? 1) - 1)
const filteredRows = computed(() => {
  const query = filterQuery.value.trim().toLocaleLowerCase()
  const rows = currentRows.value.map((row, index) => ({ row, index }))
  if (!query) return rows

  return rows.filter(({ row, index }) => columns.some(({ key }) => {
    const value = key === 'n'
      ? currentStart.value + index + 1
      : key === 'photo'
        ? ''
        : display(row, key)
    return String(value).toLocaleLowerCase().includes(query)
  }))
})
const statusText = computed(() => {
  if (busy.value) return `Loading page ${pendingPage.value}…`
  return loadError.value
})
const itemsPerPage = ref(10)

let localId = 0

function blankUser(): UserForm {
  const today = new Date()
  return {
    id: null,
    photo: '',
    name: '',
    email: '',
    bio: '',
    role: '',
    country: '',
    created: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    verified: '',
    contact: 'email',
    notify: true,
    avatar: null,
  }
}

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
  return dateKeys.has(key)
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
    ...blankUser(),
    id: stringValue(user.id),
    photo: stringValue(user.profile_pic),
    name,
    email: stringValue(user.email),
    role: stringValue(user.role),
    country: stringValue(address.country),
    created: toISODate(user.created_at),
    verified: toISODate(user.email_verified_at),
  }
}

function openForm(row?: UserRow): void {
  Object.assign(form, row ? { ...row } : blankUser())
  errors.name = ''
  errors.email = ''
  errors.role = ''
  formDialog.value = true
}

function requestDelete(row: UserRow): void {
  rowToDelete.value = row
}

function deleteRow(): void {
  const row = rowToDelete.value
  if (!row) return

  const rows = currentRows.value.filter((current) => current.id !== row.id)
  total.value = Math.max(0, (total.value ?? currentRows.value.length) - 1)
  pageCount.value = Math.max(1, Math.ceil(total.value / itemsPerPage.value))
  cache.value = {
    ...cache.value,
    [page.value]: {
      rows,
      from: currentPage.value?.from ?? (page.value - 1) * itemsPerPage.value + 1,
    },
  }
  if (page.value > pageCount.value) page.value = pageCount.value
  rowToDelete.value = null
}

async function save(): Promise<void> {
  errors.name = form.name.trim() ? '' : 'Enter a name'
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'Enter a valid email address'
  errors.role = form.role.trim() ? '' : 'Enter a role'
  if (errors.name || errors.email || errors.role) return

  saving.value = true
  try {
    await new Promise<void>((resolve) => window.setTimeout(resolve, 600))

    const id = form.id ?? `local-${Date.now()}-${++localId}`
    const savedRow: UserRow = { ...form, id }
    const rows = [...currentRows.value]
    const existingIndex = rows.findIndex((row) => row.id === id)
    if (existingIndex >= 0) {
      rows[existingIndex] = savedRow
    } else {
      rows.push(savedRow)
      total.value = (total.value ?? rows.length - 1) + 1
      pageCount.value = Math.max(1, Math.ceil(total.value / itemsPerPage.value))
    }

    cache.value = {
      ...cache.value,
      [page.value]: {
        rows,
        from: currentPage.value?.from ?? (page.value - 1) * itemsPerPage.value + 1,
      },
    }
    formDialog.value = false
  } finally {
    saving.value = false
  }
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && full.value) {
    full.value = false
  }
}

function clearTable(): void {
  if (busy.value) return
  cache.value = {}
  total.value = null
  pageCount.value = 1
  page.value = 1
  pendingPage.value = null
  loadError.value = ''
}

async function loadTestData(): Promise<void> {
  if (busy.value) return
  cache.value = {}
  total.value = null
  pageCount.value = 1
  page.value = 1
  loadError.value = ''
  await goTo(1)
}

async function changeItemsPerPage(requestedItemsPerPage: number): Promise<void> {
  if (busy.value || requestedItemsPerPage === itemsPerPage.value) return
  itemsPerPage.value = requestedItemsPerPage
  cache.value = {}
  total.value = null
  pageCount.value = 1
  page.value = 1
  loadError.value = ''
  await goTo(1)
}

async function fetchPage(pageNumber: number, requestedItemsPerPage: number): Promise<ApiPage> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetch(`${API}?page=${pageNumber}&per_page=${requestedItemsPerPage}`)
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

async function goTo(target: number): Promise<void> {
  if (busy.value) return
  const targetPage = Math.min(Math.max(1, target), pageCount.value)
  if (!cache.value[targetPage]) {
    busy.value = true
    pendingPage.value = targetPage
    loadError.value = ''
    try {
      const result = await fetchPage(targetPage, itemsPerPage.value)
      total.value = result.total ?? total.value ?? result.data.length
      pageCount.value = result.last_page || pageCount.value
      itemsPerPage.value = result.per_page || itemsPerPage.value
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
  } else if (targetPage === page.value) return

  page.value = targetPage
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  void goTo(1)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
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

.local-data-note {
  margin: 0 0 12px;
  color: #5b6272;
  font-size: 0.85rem;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.table-filter-group {
  display: flex;
  flex: 1 1 360px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 0 12px;
}

.table-filter {
  flex: 0 1 320px;
}

.table-filter-note {
  margin: 0;
  color: #5b6272;
  font-size: 0.75rem;
}

@media (max-width: 600px) {
  .table-toolbar,
  .table-filter-group {
    align-items: stretch;
    flex-direction: column;
    gap: 4px;
  }

  .table-filter {
    flex: 0 0 auto;
    width: 100%;
  }
}

.wrap {
  container-type: inline-size;
  overflow: auto;
  overscroll-behavior: contain;
  overflow-anchor: none;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  scrollbar-color: #8a92a6 #e6e8ee;
  max-height: calc(100vh - 550px);
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

.delete-action {
  width: 48px;
  min-width: 48px;
  max-width: 48px;
  padding: 2px 4px;
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

table {
  width: 100%;
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

td.empty-state {
  padding: 24px;
  color: #5b6272;
  text-align: center;
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

.user-row {
  cursor: pointer;
}

.user-row:focus-visible {
  outline: 2px solid #2f5bea;
  outline-offset: -2px;
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

/*
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
  */

.footer {
  margin-top: 14px;
}

.footer :deep(.pagination) {
  margin-top: 0;
}

.info {
  color: #5b6272;
  font-size: 0.9rem;
}

.table-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.user-form-fields {
  max-height: min(65vh, 620px);
  overflow-y: auto;
}

.form-note {
  margin: 0 0 12px;
  color: #5b6272;
  font-size: 0.85rem;
}
</style>
