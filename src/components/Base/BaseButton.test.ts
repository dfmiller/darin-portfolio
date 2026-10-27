import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import vuetify from '@/plugins/vuetify'
import BaseButton from './BaseButton.vue'
import BaseIconButton from './BaseIconButton.vue'

const global = { plugins: [vuetify] }

describe('BaseButton', () => {
  it('renders its slot content inside a button', () => {
    const wrapper = mount(BaseButton, { global, slots: { default: 'Save' } })

    expect(wrapper.find('button').text()).toBe('Save')
  })

  it('uses the flat primary style by default', () => {
    const wrapper = mount(BaseButton, { global, slots: { default: 'Save' } })

    expect(wrapper.find('button').classes()).toContain('v-btn--variant-flat')
  })

  it('maps variants to Vuetify styles', () => {
    const secondary = mount(BaseButton, {
      global,
      props: { variant: 'secondary' },
      slots: { default: 'Cancel' },
    })
    const quiet = mount(BaseButton, {
      global,
      props: { variant: 'quiet' },
      slots: { default: 'Skip' },
    })

    expect(secondary.find('button').classes()).toContain('v-btn--variant-outlined')
    expect(quiet.find('button').classes()).toContain('v-btn--variant-text')
  })

  it('emits click when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      global,
      attrs: { onClick },
      slots: { default: 'Save' },
    })

    await wrapper.find('button').trigger('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire click when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BaseButton, {
      global,
      props: { disabled: true },
      attrs: { onClick },
      slots: { default: 'Save' },
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    await wrapper.find('button').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows a loading state', () => {
    const wrapper = mount(BaseButton, {
      global,
      props: { loading: true },
      slots: { default: 'Save' },
    })

    expect(wrapper.find('button').classes()).toContain('v-btn--loading')
  })
})

describe('BaseIconButton', () => {
  it('exposes its label as the accessible name and tooltip', () => {
    const wrapper = mount(BaseIconButton, {
      global,
      props: { icon: 'mdi-pencil', label: 'Edit user' },
    })
    const button = wrapper.find('button')

    expect(button.attributes('aria-label')).toBe('Edit user')
    expect(button.attributes('title')).toBe('Edit user')
  })

  it('uses the error color when danger is set', () => {
    const wrapper = mount(BaseIconButton, {
      global,
      props: { icon: 'mdi-delete', label: 'Delete user', danger: true },
    })

    expect(wrapper.find('button').classes()).toContain('text-error')
  })
})