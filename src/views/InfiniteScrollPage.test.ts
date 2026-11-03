import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import InfiniteScrollPage from './InfiniteScrollPage.vue'

describe('InfiniteScrollPage.vue', () => {
  it('selects the tab named in a query-style hash', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/infinite-scroll', component: InfiniteScrollPage }],
    })

    await router.push('/infinite-scroll#users=&page=1')

    const wrapper = mount(InfiniteScrollPage, {
      global: {
        plugins: [router],
        stubs: {
          BaseTabs: {
            props: ['modelValue'],
            template: '<div data-testid="active-tab">{{ modelValue }}</div>',
          },
        },
      },
    })

    await nextTick()

    expect(wrapper.get('[data-testid="active-tab"]').text()).toBe('users')
    wrapper.unmount()
  })
})
