<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object, Array],
    default: '',
  },
  label: String,
  hint: String,
  error: String,
  rules: { type: [Array, Function], default: () => [] },
  variant: { type: String, default: 'underlined' },
  range: { type: Boolean, default: false },
  allowedDates: { type: Function, default: null },
  min: { type: [String, Date], default: null },
  max: { type: [String, Date], default: null },
})

const emit = defineEmits(['update:modelValue'])
const menu = ref(false)

// Helper to parse dynamic keywords ('today', 'yesterday', 'tomorrow') into Date objects
const parseDynamicDate = (val) => {
  if (!val) return null
  if (val instanceof Date) return val

  const d = new Date()
  d.setHours(0, 0, 0, 0)

  if (typeof val === 'string') {
    const keyword = val.toLowerCase().trim()
    if (keyword === 'today') return d
    if (keyword === 'yesterday') {
      d.setDate(d.getDate() - 1)
      return d
    }
    if (keyword === 'tomorrow') {
      d.setDate(d.getDate() + 1)
      return d
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [year, month, day] = val.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
  }
  return null
}

const computedMin = computed(() => parseDynamicDate(props.min))
const computedMax = computed(() => parseDynamicDate(props.max))

const formatDateToIso = (dateInput) => {
  if (!dateInput) return null
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput
  }
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return null

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const selectDate = (value) => {
  if (props.range) {
    const dates = Array.isArray(value) ? value : [value]
    const isoDates = dates.map(formatDateToIso).filter(Boolean)

    if (isoDates.length >= 2) {
      isoDates.sort()
      emit('update:modelValue', { start: isoDates[0], end: isoDates[isoDates.length - 1] })
    } else if (isoDates.length === 1) {
      emit('update:modelValue', { start: isoDates[0], end: null })
    } else {
      emit('update:modelValue', { start: null, end: null })
    }
    return
  }

  const date = Array.isArray(value) ? value[0] : value
  const isoDate = formatDateToIso(date)
  
  if (!isoDate) return

  emit('update:modelValue', isoDate)
  menu.value = false
}

// Generates an array of all dates between start and end (inclusive) so Vuetify highlights the range
const pickerModelValue = computed(() => {
  if (!props.range) return props.modelValue

  if (props.modelValue && typeof props.modelValue === 'object') {
    const { start, end } = props.modelValue
    if (!start) return []
    if (!end) return [start]

    const startDate = new Date(start + 'T00:00:00')
    const endDate = new Date(end + 'T00:00:00')
    const rangeArray = []

    let current = new Date(startDate)
    while (current <= endDate) {
      rangeArray.push(formatDateToIso(current))
      current.setDate(current.getDate() + 1)
    }
    return rangeArray
  }
  return []
})

// Text field display: separated by a dash (-)
const formattedDisplayValue = computed(() => {
  if (props.range && props.modelValue && typeof props.modelValue === 'object') {
    const { start, end } = props.modelValue
    if (start && end) return `${start} - ${end}`
    if (start) return `${start} - ...`
    return ''
  }
  return props.modelValue || ''
})

// Helper to convert YYYY-MM-DD to a local Date object without timezone shift
const parseIsoToLocalDate = (isoStr) => {
  if (!isoStr) return null
  const [year, month, day] = isoStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Friendly formatted date range using a dash (-)
const friendlyRangeDisplay = computed(() => {
  if (!props.range || !props.modelValue || typeof props.modelValue !== 'object') return ''
  const { start, end } = props.modelValue
  if (!start) return 'Select Date Range'

  const startDate = parseIsoToLocalDate(start)
  const endDate = end ? parseIsoToLocalDate(end) : null

  const currentYear = new Date().getFullYear()
  const startYear = startDate.getFullYear()
  const endYear = endDate ? endDate.getFullYear() : startYear

  const showYear = startYear !== currentYear || endYear !== currentYear || startYear !== endYear

  const monthFormat = { month: 'short' }
  const dayFormat = { day: 'numeric' }

  const startMonthStr = startDate.toLocaleDateString(undefined, monthFormat)
  const startDayStr = startDate.toLocaleDateString(undefined, dayFormat)

  if (!endDate) {
    return `${startMonthStr} ${startDayStr}${showYear ? ', ' + startYear : ''} - ...`
  }

  const endMonthStr = endDate.toLocaleDateString(undefined, monthFormat)
  const endDayStr = endDate.toLocaleDateString(undefined, dayFormat)

  if (startDate.getMonth() === endDate.getMonth() && startYear === endDate.getFullYear()) {
    return `${startMonthStr} ${startDayStr} - ${endDayStr}, ${startYear}`
  }

  if (startYear === endYear) {
    return `${startMonthStr} ${startDayStr} - ${endMonthStr} ${endDayStr}, ${startYear}`
  }

  return `${startMonthStr} ${startDayStr}, ${startYear} - ${endMonthStr} ${endDayStr}, ${endYear}`
})

// Adaptive font sizing based on length of the friendly range text
const headerFontSize = computed(() => {
  const len = friendlyRangeDisplay.value.length
  if (len > 26) return '1.0rem'
  if (len > 20) return '1.2rem'
  return '1.5rem'
})
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :model-value="formattedDisplayValue"
        :label="label"
        :variant="variant"
        density="comfortable"
        readonly
        clearable
        append-inner-icon="mdi-calendar"
        :hint="hint"
        :persistent-hint="!!hint"
        :error-messages="error"
        :rules="rules"
        @click:clear.stop="emit('update:modelValue', range ? { start: null, end: null } : '')"
      />
    </template>
    
    <v-date-picker
      :model-value="pickerModelValue"
      :multiple="range ? 'range' : false"
      :min="computedMin"
      :max="computedMax"
      :allowed-dates="allowedDates"
      color="primary"
      show-adjacent-months
      @update:model-value="selectDate"
    >
      <!-- Custom header slot using high-contrast text color and long dash formatting -->
      <template v-if="range" #header>
        <div class="pa-4 font-weight-bold" :style="{ fontSize: headerFontSize, color: 'rgb(var(--v-theme-on-primary))' }">
          {{ friendlyRangeDisplay }}
        </div>
      </template>
    </v-date-picker>
  </v-menu>
</template>