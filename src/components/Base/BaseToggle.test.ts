import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
//import vuetify from '@/plugins/vuetify'
import BaseSwitch from './BaseSwitch.vue'
import BaseCheckbox from './BaseCheckbox.vue'

//const global = { plugins: [vuetify] }

describe.each([
  ['BaseSwitch', BaseSwitch],
  ['BaseCheckbox', BaseCheckbox],
])('%s', (_name, Component) => {
  it('renders its label', () => {
    const wrapper = mount(Component, {
      //global,
      props: { modelValue: false, label: 'Dark mode' },
    })

    expect(wrapper.find('label').text()).toBe('Dark mode')
  })

  it('reflects the modelValue', () => {
    const off = mount(Component, { props: { modelValue: false, label: 'A' } })
    const on = mount(Component, { props: { modelValue: true, label: 'A' } })

    expect((off.find('input').element as HTMLInputElement).checked).toBe(false)
    expect((on.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue when toggled on', async () => {
    const wrapper = mount(Component, {
      //global,
      props: { modelValue: false, label: 'A' },
    })
    const input = wrapper.find('input')

    ;(input.element as HTMLInputElement).checked = true
    await input.trigger('input')

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events!.at(-1)).toEqual([true])
  })

  it('emits update:modelValue when toggled off', async () => {
    const wrapper = mount(Component, {
      //global,
      props: { modelValue: true, label: 'A' },
    })
    const input = wrapper.find('input')

    ;(input.element as HTMLInputElement).checked = false
    await input.trigger('input')

    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([false])
  })

  it('disables the input when disabled', () => {
    const wrapper = mount(Component, {
      //global,
      props: { modelValue: false, label: 'A', disabled: true },
    })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})