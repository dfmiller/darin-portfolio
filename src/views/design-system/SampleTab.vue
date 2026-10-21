<script setup>
import { ref, reactive, computed } from 'vue'
import BaseDialog from '../../components/Base/BaseDialog.vue'
import BaseSwitch from '../../components/Base/BaseSwitch.vue'

const roles = [{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }, { value: 'viewer', label: 'Viewer' }]
const contacts = [{ value: 'email', label: 'Email' }, { value: 'phone', label: 'Phone' }, { value: 'none', label: 'Don\'t contact' }]
const columns = [
  { key: 'n', label: '#' }, { key: 'photo', label: 'Photo' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' },
  { key: 'country', label: 'Country' }, { key: 'created', label: 'Created' },
  { key: 'verified', label: 'Verified' }, { key: 'id', label: 'ID' },
  { key: 'actions', label: '' },
]

const blank = () => ({
  n: 0, photo: '', id: null, name: '', username: '', email: '', bio: '', role: null,
  country: '', created: '', verified: '',
  notify: true, contact: 'email', avatar: null,
})
const rows = ref([])

const formDialog = ref(false)
const form = reactive(blank())
const isVerified = computed({
  get: () => Boolean(form.verified),
  set: (value) => {
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
const errors = reactive({})
const saving = ref(false)
const loading = ref(false)
const page = ref(1)
const pageCount = ref(0)
const total = ref(0)
const itemsPerPage = ref(10)
const rangeStart = ref(0)
const rangeEnd = ref(0)
const toast = ref(false)
const toastMessage = ref('')
const deleting = ref(null)
const clearConfirmation = ref(false)
let nextId = 10
let loaded = false

const toDateInput = (value) => {
  if (!value) return ''
  const string = String(value)
  const match = string.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (match) return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`
  const timestamp = Date.parse(string)
  return Number.isNaN(timestamp) ? '' : new Date(timestamp).toISOString().slice(0, 10)
}

const normalizeUser = (user, index) => {
  const address = user.address && typeof user.address === 'object' ? user.address : {}
  const name = [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(' ')
  return {
    ...blank(),
    n: index,
    photo: user.profile_pic == null ? '' : String(user.profile_pic),
    id: user.id == null ? null : String(user.id),
    name,
    username: user.username == null ? '' : String(user.username),
    email: user.email == null ? '' : String(user.email),
    role: user.role == null ? null : String(user.role),
    country: address.country == null ? '' : String(address.country),
    created: toDateInput(user.created_at),
    verified: toDateInput(user.email_verified_at),
  }
}

const openForm = (row) => {
  Object.assign(form, row ? { ...row } : blank())
  Object.keys(errors).forEach(k => delete errors[k])
  formDialog.value = true
}
const validate = () => {
  errors.name = form.name.trim() ? '' : 'Enter a name'
  errors.email = /\S+@\S+\.\S+/.test(form.email) ? '' : 'Enter an email like name@company.com'
  errors.role = form.role ? '' : 'Choose a role'
  return !Object.values(errors).some(Boolean)
}
const save = async () => {
  if (!validate()) return
  saving.value = true
  await new Promise(r => setTimeout(r, 600))
  if (form.id) rows.value = rows.value.map(r => (r.id === form.id ? { ...form } : r))
  else rows.value = [...rows.value, { ...form, id: nextId++ }]
  saving.value = false
  formDialog.value = false
  toastMessage.value = 'User saved'
  toast.value = true
}
const confirmDelete = () => {
  rows.value = rows.value.filter(r => r.id !== deleting.value.id)
  total.value = Math.max(0, total.value - 1)
  deleting.value = null
  toastMessage.value = 'User removed'
  toast.value = true
}
const clearRows = () => {
  if (loading.value) return
  rows.value = []
  page.value = 1
  pageCount.value = 0
  total.value = 0
  itemsPerPage.value = 10
  rangeStart.value = 0
  rangeEnd.value = 0
  loaded = false
}
const confirmClearRows = () => {
  clearRows()
  clearConfirmation.value = false
}
const loadRows = async (targetPage = 1) => {
  loading.value = true
  try {
    const response = await fetch(`https://jsonfakery.com/users/paginated?page=${targetPage}&per_page=10`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const result = await response.json()
    if (!Array.isArray(result?.data) || !result.data.every(user => user && typeof user === 'object' && !Array.isArray(user))) {
      throw new Error('Unexpected response format')
    }
    const responsePerPage = Number(result.per_page)
    const responseTotal = Number(result.total)
    const responseFrom = Number(result.from)
    const responsePageCount = Number(result.last_page)
    itemsPerPage.value = Number.isInteger(responsePerPage) && responsePerPage > 0 ? responsePerPage : 10
    total.value = Number.isFinite(responseTotal) && responseTotal >= 0
      ? responseTotal
      : result.data.length
    pageCount.value = Number.isInteger(responsePageCount) && responsePageCount >= 0
      ? responsePageCount
      : Math.ceil(total.value / itemsPerPage.value)
    page.value = targetPage
    const firstRowNumber = Number.isInteger(responseFrom) && responseFrom > 0
      ? responseFrom
      : (targetPage - 1) * itemsPerPage.value + 1
    rangeStart.value = result.data.length ? firstRowNumber : 0
    rangeEnd.value = result.data.length ? firstRowNumber + result.data.length - 1 : 0
    rows.value = result.data.map((user, index) => normalizeUser(user, firstRowNumber + index))
    loaded = true
    if (targetPage === 1) {
      toastMessage.value = 'Users loaded'
      toast.value = true
    }
  } catch (error) {
    toastMessage.value = `Could not load users: ${error instanceof Error ? error.message : String(error)}`
    toast.value = true
  } finally {
    loading.value = false
  }
}
const changePage = (targetPage) => {
  if (loaded && targetPage !== page.value) void loadRows(targetPage)
}
</script>

<template>
  <section>
    <div class="d-flex align-center mb-4">
      <p>Search, sort, add, edit and remove users.</p>
      <v-spacer />
      <BaseButton @click="openForm()">Add User</BaseButton>
    </div>

    <BaseTable
      class="sample-table"
      :columns="columns"
      :rows="rows"
      :items-per-page="itemsPerPage"
      :page="page"
      :server-items-length="total"
      :loading="loading"
      fixed-header
      hide-default-footer
      @update:page="changePage"
      @click:row="openForm"
    >
      <template #item.photo="{ item }">
        <BaseAvatar :src="item.photo" :alt="`${item.name}'s profile photo`" :size="32" />
      </template>
      <template #item.actions="{ item }">
        <BaseIconButton icon="mdi-pencil-outline" label="Edit user" @click.stop="openForm(item)" />
        <BaseIconButton icon="mdi-delete-outline" label="Remove user" danger @click.stop="deleting = item" />
      </template>
      <template #no-data><p class="pa-6">No users yet. Use Add User to create the first one.</p></template>
    </BaseTable>

    <BasePagination
      v-if="loaded"
      :model-value="page"
      :page-count="pageCount"
      :total="total"
      :items-per-page="itemsPerPage"
      :loading="loading"
      @update:model-value="changePage"
    />

    <v-divider class="my-4" />

    <div class="sample-actions">
      <BaseButton variant="quiet" :disabled="loading" @click="clearConfirmation = true">Clear Table</BaseButton>
      <BaseButton :loading="loading" @click="loadRows()">Load Test Data</BaseButton>
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
        <BaseTextField v-model="form.name" label="Full name" :error="errors.name" />
        <BaseTextField v-model="form.email" label="Work email" hint="Used for sign-in" :error="errors.email" />
        <BaseTextarea v-model="form.bio" label="Bio" />
        <BaseSelect v-model="form.role" label="Role" :options="roles" :error="errors.role" />
        <BaseTextField v-model="form.country" label="Country" />
        <BaseDateField v-model="form.created" label="Created" />
        <BaseRadioGroup v-model="form.contact" label="Preferred contact" :options="contacts" />
        <BaseCheckbox v-model="form.notify" label="Send email notifications" />
        <BaseSwitch v-model="isVerified" label="Verified" />
        <BaseFileInput v-model="form.avatar" label="Profile photo" accept="image/*" class="mt-4" />
        <BaseTextField :model-value="form.id ?? 'Assigned on save'" label="ID" disabled />
      </div>
    </BaseDialog>

    <BaseDialog :model-value="!!deleting" title="Remove this user?" confirm-label="Remove user" danger
      @update:model-value="deleting = null" @confirm="confirmDelete">
      {{ deleting?.name }} loses access immediately.
    </BaseDialog>
    <BaseDialog
      v-model="clearConfirmation"
      title="Clear the table?"
      confirm-label="Clear table"
      danger
      @confirm="confirmClearRows"
    >
      This will remove all loaded users from the table.
    </BaseDialog>
    <BaseToast v-model="toast" :message="toastMessage" />
  </section>
</template>

<style scoped>
.sample-table {
  --table-header-bg: #eef0f5;

  color: #1f2430;
  font-family: system-ui, sans-serif;
}

.user-form-fields {
  max-height: min(65vh, 620px);
  overflow-y: auto;
}

.sample-table :deep(.v-table) {
  --v-table-header-height: 38px;

  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
  color: #1f2430;
}

.sample-table :deep(.v-table__wrapper) {
  scrollbar-color: #8a92a6 #e6e8ee;
}

.sample-table :deep(.v-table__wrapper th) {
  background: var(--table-header-bg);
  color: #1f2430;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.sample-table :deep(.v-table__wrapper td),
.sample-table :deep(.v-table__wrapper th) {
  border-bottom: 1px solid #e6e8ee;
}

.sample-table :deep(.v-table__wrapper tbody tr:hover) {
  background: #fafbfd;
}

.sample-table :deep(.v-table__wrapper th:first-child),
.sample-table :deep(.v-table__wrapper td:first-child) {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--table-header-bg);
  border-right: 1px solid #e6e8ee;
}

.sample-table :deep(.v-table__wrapper td:first-child) {
  background: var(--table-header-bg);
}

.sample-table :deep(.v-table__wrapper tbody tr:hover td:first-child) {
  background: #fafbfd;
}

.sample-table :deep(.v-table__wrapper th:first-child) {
  z-index: 2;
}

.sample-table :deep(.v-table__wrapper td) {
  padding: 10px 14px;
  vertical-align: top;
}

.sample-table :deep(.v-table__wrapper)::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

.sample-table :deep(.v-table__wrapper)::-webkit-scrollbar-track {
  background: #e6e8ee;
}

.sample-table :deep(.v-table__wrapper)::-webkit-scrollbar-thumb {
  border: 3px solid #e6e8ee;
  border-radius: 7px;
  background: #8a92a6;
}

.sample-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
</style>
