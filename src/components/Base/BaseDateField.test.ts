import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import BaseDateField from './BaseDateField.vue'

describe('BaseDateField.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 28, 12, 0, 0)) // Oct 28, 2026
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders properly with a label', () => {
    const wrapper = mount(BaseDateField, {
      props: {
        label: 'Select Date',
        modelValue: '',
      },
      global: {
        stubs: {
          // Stub out Vuetify components if not globally registered in tests
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('Select Date')
  })

  it('handles single date selection correctly', async () => {
    const wrapper = mount(BaseDateField, {
      props: {
        modelValue: '',
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })

    const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
    await datePicker.vm.$emit('update:modelValue', new Date(2026, 9, 15))

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-10-15'])
  })

  it('handles date range selection and emits { start, end } object', async () => {
    const wrapper = mount(BaseDateField, {
      props: {
        range: true,
        modelValue: { start: null, end: null },
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })

    const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
    
    await datePicker.vm.$emit('update:modelValue', [
      new Date(2026, 9, 1),
      new Date(2026, 9, 15),
    ])

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.pop()
    expect(emittedValue?.[0]).toEqual({
      start: '2026-10-01',
      end: '2026-10-15',
    })
  })

  it('correctly formats the friendly display header for a range', () => {
    const wrapper = mount(BaseDateField, {
      props: {
        range: true,
        modelValue: { start: '2026-10-01', end: '2026-10-15' },
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Oct 1 - 15, 2026')
  })

  it('parses dynamic min and max keywords correctly (today, yesterday, tomorrow)', () => {
    const wrapper = mount(BaseDateField, {
      props: {
        min: 'yesterday',
        max: 'tomorrow',
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })

    const datePicker = wrapper.findComponent({ name: 'VDatePicker' })
    const minProp = datePicker.props('min')
    const maxProp = datePicker.props('max')

    expect(minProp.getDate()).toBe(27)
    expect(maxProp.getDate()).toBe(29)
  })

  it('clears the value correctly when the clear button is clicked', async () => {
    const wrapper = mount(BaseDateField, {
      props: {
        range: true,
        modelValue: { start: '2026-10-01', end: '2026-10-05' },
      },
      global: {
        stubs: {
          VMenu: {
            template: '<div><slot name="activator" :props="{}" /><slot /></div>',
          },
        },
      },
    })

    const textField = wrapper.findComponent({ name: 'VTextField' })
    // Pass a mock event object with stopPropagation so `.stop` modifier doesn't throw
    await textField.vm.$emit('click:clear', { stopPropagation: () => {} })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedValue = wrapper.emitted('update:modelValue')?.pop()
    expect(emittedValue?.[0]).toEqual({ start: null, end: null })
  })
})