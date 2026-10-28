import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseDialog from './BaseDialog.vue'

describe('BaseDialog.test.ts > BaseDialog.vue', () => {
  it('renders properly when open with a title and slot content', () => {
    const wrapper = mount(BaseDialog, {
      props: {
        modelValue: true,
        title: 'Confirm Action',
      },
      slots: {
        default: '<p>Are you sure you want to proceed?</p>',
      },
      global: {
        stubs: {
          // Disable transitions and keep content inline for jsdom testing
          VDialog: {
            template: '<div><slot /></div>',
          },
          BaseButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Confirm Action')
    expect(wrapper.text()).toContain('Are you sure you want to proceed?')
  })

  it('emits update:modelValue with false when close button is clicked', async () => {
    const wrapper = mount(BaseDialog, {
      props: {
        modelValue: true,
        title: 'Test Dialog',
        closeLabel: 'Close',
      },
      global: {
        stubs: {
          VDialog: {
            template: '<div><slot /></div>',
          },
          BaseButton: {
            // Forward click events from stubbed component to test emitter
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    // First button is the close button
    await buttons[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('renders confirm button when confirmLabel is provided and emits confirm event', async () => {
    const wrapper = mount(BaseDialog, {
      props: {
        modelValue: true,
        title: 'Delete Item',
        confirmLabel: 'Delete',
        danger: true,
        confirmLoading: false,
      },
      global: {
        stubs: {
          VDialog: {
            template: '<div><slot /></div>',
          },
          BaseButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    // Should have both close and confirm buttons
    expect(buttons.length).toBe(2)
    expect(buttons[1].text()).toContain('Delete')

    await buttons[1].trigger('click')
    expect(wrapper.emitted('confirm')).toBeTruthy()
  })

  it('hides confirm button when confirmLabel is not provided', () => {
    const wrapper = mount(BaseDialog, {
      props: {
        modelValue: true,
        title: 'Notice',
        confirmLabel: null,
      },
      global: {
        stubs: {
          VDialog: {
            template: '<div><slot /></div>',
          },
          BaseButton: {
            template: '<button><slot /></button>',
          },
        },
      },
    })

    const buttons = wrapper.findAll('button')
    // Only the close button should be present
    expect(buttons.length).toBe(1)
  })

it('passes width and maxWidth props to v-dialog', () => {
    const wrapper = mount(BaseDialog, {
      props: {
        modelValue: true,
        title: 'Sized Dialog',
        width: 600,
        maxWidth: '80vw',
      },
      global: {
        stubs: {
          VDialog: {
            // Bind props as data attributes so we can assert on them directly
            template: '<div class="v-dialog-stub" :data-width="width" :data-max-width="maxWidth"><slot /></div>',
            props: ['width', 'maxWidth'],
          },
          BaseButton: true,
        },
      },
    })

    const vDialogElement = wrapper.find('.v-dialog-stub')
    expect(vDialogElement.attributes('data-width')).toBe('600')
    expect(vDialogElement.attributes('data-max-width')).toBe('80vw')
  })
})