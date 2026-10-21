<script setup lang="ts">
import { ref } from 'vue'

const textValue = ref('')
const emailValue = ref('')
const numberValue = ref(5)
const textareaValue = ref('')
const autocompleteValue = ref('')
const selectValue = ref('')
const comboboxValue = ref('')
const combinedAutocompleteValue = ref('')
const combinedSelectValue = ref('')
const dateValue = ref('')
const fileValue = ref<File | null>(null)
const checkboxValue = ref(false)
const switchValue = ref(true)
const radioValue = ref('email')
const activeTab = ref('overview')
const dialogOpen = ref(false)
const toastOpen = ref(false)
const formDialogOpen = ref(false)

const options = [
  { value: 'admin', label: 'Administrator' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
]
const contactOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'none', label: `Don't contact` },
]
const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
]
const tableRows = [
  { name: 'Alex Morgan', role: 'Editor', status: 'Active' },
  { name: 'Sam Rivera', role: 'Administrator', status: 'Active' },
  { name: 'Jordan Lee', role: 'Viewer', status: 'Invited' },
]

const openToast = () => {
  toastOpen.value = false
  requestAnimationFrame(() => {
    toastOpen.value = true
  })
}

const confirmDialog = () => {
  dialogOpen.value = false
  formDialogOpen.value = false
  openToast()
}
</script>

<template>
  <div class="component-catalog">

    <div class="section-links">
        <a href="#avatars">Avatars</a>
        <a href="#buttons">Buttons</a>
        <a href="#checkbox">Checkbox</a>
        <a href="#combobox">Combobox</a>
        <a href="#date-field">Date field</a>
        <a href="#dialog">Dialog</a>
        <a href="#file-input">File input</a>
        <a href="#icon-buttons">Icon buttons</a>
        <a href="#radio-group">Radio group</a>
        <a href="#switch">Switch</a>
        <a href="#table">Table</a>
        <a href="#tabs">Tabs</a>
        <a href="#text-fields">Text fields</a>
        <a href="#textarea">Textarea</a>       
        <a href="#toast">Toast</a>
    </div>
    
    <section id="avatars" class="component-section">
      <h2>Avatars</h2>
      <div class="examples">
        <BaseAvatar :size="32" alt="Small avatar" src="https://testingbot.com/free-online-tools/random-avatar/32" />
        <BaseAvatar :size="32" alt="Small avatar" />
        <BaseAvatar :size="48" alt="Medium avatar" src="https://testingbot.com/free-online-tools/random-avatar/48" />
        <BaseAvatar :size="48" alt="Medium avatar" />
        <BaseAvatar :size="64" alt="Large avatar" src="https://testingbot.com/free-online-tools/random-avatar/64" />
        <BaseAvatar :size="64" alt="Large avatar" />
      </div>
    </section>

    <section id="buttons" class="component-section">
      <h2>Buttons</h2>
      <div class="examples">
        <BaseButton variant="primary">Primary</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="quiet">Quiet</BaseButton>
        <BaseButton variant="danger">Error</BaseButton>
        <BaseButton variant="warning">Warning</BaseButton>
        <BaseButton variant="info">Info</BaseButton>
        <BaseButton variant="success">Success</BaseButton>
        <BaseButton disabled>Disabled</BaseButton>
        <BaseButton loading>Loading</BaseButton>
      </div>
    </section>

    <section id="checkbox" class="component-section">
      <h2>Checkbox</h2>
      <div class="examples examples--stacked">
        <BaseCheckbox v-model="checkboxValue" label="Accept the terms" />
        <BaseCheckbox label="Disabled option" disabled />
      </div>
    </section>

    <section id="combobox" class="component-section">
      <h2>Combobox</h2>
      <div class="field-grid">
        <BaseCombobox v-model="comboboxValue" label="Combobox" :options="options" hint="Choose or enter a custom value" />
        <BaseCombobox v-model="combinedAutocompleteValue" mode="autocomplete" label="Autocomplete" :options="options" hint="Search existing options" />
        <BaseCombobox v-model="combinedSelectValue" mode="select" label="Select" :options="options" hint="Choose an existing option" />
      </div>
    </section>

    <section class="component-section">
      <h2>Date field</h2>
      <BaseDateField v-model="dateValue" label="Start date" hint="Opens a date picker" />
    </section>

    <section class="component-section">
      <h2>Dialog</h2>
      <div class="examples">
        <BaseButton @click="dialogOpen = true">Open confirmation</BaseButton>
        <BaseButton variant="secondary" @click="formDialogOpen = true">Open form dialog</BaseButton>
      </div>
      <BaseDialog
        v-model="dialogOpen"
        title="Discard changes?"
        confirm-label="Discard"
        danger
        @confirm="confirmDialog"
      >
        Any unsaved changes will be lost.
      </BaseDialog>
      <BaseDialog
        v-model="formDialogOpen"
        title="Example dialog"
        confirm-label="Save"
        max-width="560"
        @confirm="confirmDialog"
      >
        <BaseTextField label="Dialog field" />
        <BaseTextField label="Another field" />
      </BaseDialog>
    </section>

    <section class="component-section">
      <h2>File input</h2>
      <BaseFileInput v-model="fileValue" label="Upload a file" accept="image/*" hint="Images only" />
    </section>

    <section id="icon-buttons" class="component-section">
      <h2>Icon buttons</h2>
      <div class="examples">
        <BaseIconButton icon="mdi-pencil-outline" label="Edit" />
        <BaseIconButton icon="mdi-delete-outline" label="Delete" danger />
        <BaseIconButton icon="mdi-close" label="Close" />
      </div>
    </section>

        <section class="component-section">
      <h2>Radio group</h2>
      <BaseRadioGroup v-model="radioValue" label="Preferred contact" :options="contactOptions" />
    </section>

        <section class="component-section">
      <h2>Switch</h2>
      <div class="examples examples--stacked">
        <BaseSwitch v-model="switchValue" label="Notifications enabled" />
        <BaseSwitch label="Disabled switch" disabled />
      </div>
    </section>

    <section class="component-section">
      <h2>Table</h2>
      <BaseTable :columns="tableColumns" :rows="tableRows" :items-per-page="3" />
    </section>

        <section class="component-section">
      <h2>Tabs</h2>
      <BaseTabs v-model="activeTab">
        <template #tabs>
          <v-tab value="overview">Overview</v-tab>
          <v-tab value="details">Details</v-tab>
        </template>
        <v-tabs-window-item value="overview" class="tab-example">
          Overview tab content
        </v-tabs-window-item>
        <v-tabs-window-item value="details" class="tab-example">
          Details tab content
        </v-tabs-window-item>
      </BaseTabs>
    </section>

    <section id="text-fields" class="component-section">
      <h2>Text fields</h2>
      <div class="field-grid">
        <BaseTextField v-model="textValue" label="Name" hint="Enter your full name" />
        <BaseTextField v-model="emailValue" label="Email with error" error="Enter a valid email address" />
        <BaseTextField model-value="Unavailable" label="Disabled" disabled />
        <BaseNumberField v-model="numberValue" label="Quantity" :min="0" :max="10" hint="Choose a value from 0 to 10" />
      </div>
    </section>

    <section class="component-section">
      <h2>Textarea</h2>
      <BaseTextarea v-model="textareaValue" label="Description" hint="A short summary" />
    </section>

    <section class="component-section">
      <h2>Toast</h2>
      <BaseButton @click="openToast">Show toast</BaseButton>
      <BaseToast v-model="toastOpen" message="Your changes have been saved." />
    </section>

  </div>  
</template>

<style scoped>

.section-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 16px 16px;
  position: sticky;
  top: 0;
}

.component-catalog {
  display: grid;
  gap: 24px;
  padding: 8px 0 32px;
}

.component-section {
  min-width: 0;
  padding: 20px 24px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
}

.component-section h2 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
}

.examples {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.examples--stacked {
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: 16px;
}

.selection-note {
  margin: 12px 0 0;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  font-size: 0.875rem;
}

.tab-example {
  padding: 16px 0;
}

@media (max-width: 600px) {
  .component-section {
    padding: 16px;
  }
}
</style>
