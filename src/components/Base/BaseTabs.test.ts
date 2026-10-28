import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseTabs from './BaseTabs.vue'

describe('BaseTabs.vue', () => {
  const defaultItems = [
    { title: 'Tab 1', value: 'tab-1', content: 'Content one' },
    { title: 'Tab 2', value: 'tab-2', content: 'Content two' },
  ]

  it('renders correctly with given items and default active tab', () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'tab-1',
        tabs: defaultItems,
      },
    })

    expect(wrapper.exists()).toBe(true)
    
    // Query using the standard Vuetify tab class selector
    const tabs = wrapper.findAll('.v-tab')
    expect(tabs.length).toBe(2)
    expect(tabs[0].text()).toContain('Tab 1')
    expect(tabs[1].text()).toContain('Tab 2')
  })

  it('emits update:modelValue when a different tab is selected', async () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'tab-1',
        tabs: defaultItems,
      },
    })

    const tabs = wrapper.findAll('.v-tab')
    
    // Simulate clicking the second tab
    await tabs[1].trigger('click')

    // Check if the component emits the correct value for v-model binding
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['tab-2'])
  })

  it('correctly binds the active modelValue prop', async () => {
    const wrapper = mount(BaseTabs, {
      props: {
        modelValue: 'tab-2',
        tabs: defaultItems,
      },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.props('modelValue')).toBe('tab-2')
  })
})