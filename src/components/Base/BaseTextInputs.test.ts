import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextField from './BaseTextField.vue'
import BaseTextarea from './BaseTextarea.vue'

describe('BaseTextField', () => {
  it('renders a text field with its label and value', () => {
    const wrapper = mount(BaseTextField, {
      props: { modelValue: 'Darin', label: 'First name' },
    })

    expect(wrapper.text()).toContain('First name')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('Darin')
  })

  it('emits update:modelValue as the user types', async () => {
    const wrapper = mount(BaseTextField, {
      props: { modelValue: '', label: 'First name' },
    })

    await wrapper.find('input').setValue('Darin')

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['Darin'])
  })

  it('uses the underlined, comfortable style by default', () => {
    const wrapper = mount(BaseTextField, { props: { label: 'Name' } })
    const field = wrapper.findComponent({ name: 'VTextField' })

    expect(field.props('variant')).toBe('underlined')
    expect(field.props('density')).toBe('comfortable')
  })

  it('shows the hint persistently', () => {
    const wrapper = mount(BaseTextField, {
      props: { label: 'Email', hint: 'We never share it' },
    })

    expect(wrapper.text()).toContain('We never share it')
  })

  it('shows an error message and error state', () => {
    const wrapper = mount(BaseTextField, {
      props: { label: 'Email', error: 'Email is required' },
    })

    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.find('.v-input--error').exists()).toBe(true)
  })

  it('does not render a number input for text fields', () => {
    const wrapper = mount(BaseTextField, { props: { label: 'Name' } })

    expect(wrapper.findComponent({ name: 'VTextField' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VNumberInput' }).exists()).toBe(false)
  })

  describe('type="number"', () => {
    it('renders a number input instead of a text field', () => {
      const wrapper = mount(BaseTextField, {
        props: { type: 'number', modelValue: 5, label: 'Age' },
      })

      expect(wrapper.findComponent({ name: 'VNumberInput' }).exists()).toBe(true)
    })

    it('passes min, max and step through', () => {
      const wrapper = mount(BaseTextField, {
        props: { type: 'number', modelValue: 5, label: 'Age', min: 0, max: 120, step: 5 },
      })
      const input = wrapper.findComponent({ name: 'VNumberInput' })

      expect(input.props('min')).toBe(0)
      expect(input.props('max')).toBe(120)
      expect(input.props('step')).toBe(5)
    })

    it('converts emitted values to numbers', () => {
      const wrapper = mount(BaseTextField, {
        props: { type: 'number', modelValue: 5, label: 'Age' },
      })

      wrapper.findComponent({ name: 'VNumberInput' }).vm.$emit('update:modelValue', '42')

      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([42])
    })

    it('emits null when the field is cleared', () => {
      const wrapper = mount(BaseTextField, {
        props: { type: 'number', modelValue: 5, label: 'Age' },
      })

      wrapper.findComponent({ name: 'VNumberInput' }).vm.$emit('update:modelValue', '')

      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([null])
    })
  })
})

describe('BaseTextarea', () => {
  it('renders a textarea with its label and value', () => {
    const wrapper = mount(BaseTextarea, {
      props: { modelValue: 'Hello', label: 'Notes' },
    })

    expect(wrapper.text()).toContain('Notes')
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('Hello')
  })

  it('emits update:modelValue as the user types', async () => {
    const wrapper = mount(BaseTextarea, {
      props: { modelValue: '', label: 'Notes' },
    })

    await wrapper.find('textarea').setValue('Some notes')

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['Some notes'])
  })

  it('defaults to 3 rows and the underlined style', () => {
    const wrapper = mount(BaseTextarea, { props: { label: 'Notes' } })
    const field = wrapper.findComponent({ name: 'VTextarea' })

    expect(field.props('rows')).toBe(3)
    expect(field.props('variant')).toBe('underlined')
  })

  it('shows the hint', () => {
    const wrapper = mount(BaseTextarea, {
      props: { label: 'Notes', hint: 'Keep it short' },
    })

    expect(wrapper.text()).toContain('Keep it short')
  })

  it('shows an error message instead of the hint', () => {
    const wrapper = mount(BaseTextarea, {
      props: { label: 'Notes', hint: 'Keep it short', error: 'Too long' },
    })

    expect(wrapper.text()).toContain('Too long')
    expect(wrapper.text()).not.toContain('Keep it short')
  })
})