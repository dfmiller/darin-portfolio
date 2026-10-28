import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseToast from './BaseToast.vue'

describe('BaseToast.vue', () => {
  it('renders correctly with default props', async () => {
    const wrapper = mount(BaseToast, {
      props: {
        modelValue: true,
        message: 'Test toast message',
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.props('message')).toBe('Test toast message')
  })

  it('displays the correct color prop', async () => {
    const wrapper = mount(BaseToast, {
      props: {
        modelValue: true,
        message: 'Error message',
        color: 'error',
      },
    })

    await wrapper.vm.$nextTick()

    const snackbar = wrapper.findComponent({ name: 'VSnackbar' })
    expect(snackbar.props('color')).toBe('error')
  })

  it('emits update:modelValue when the snackbar model value changes', async () => {
    const wrapper = mount(BaseToast, {
      props: {
        modelValue: true,
        message: 'Closable toast',
      },
    })

    await wrapper.vm.$nextTick()

    const snackbar = wrapper.findComponent({ name: 'VSnackbar' })
    await snackbar.vm.$emit('update:modelValue', false)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})