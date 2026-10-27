import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import vuetify from '@/plugins/vuetify'
import BasePagination from './BasePagination.vue'

function mountPagination(props: Record<string, unknown> = {}) {
  return mount(BasePagination, {
    global: { plugins: [vuetify] },
    props: { modelValue: 1, pageCount: 5, total: 47, itemsPerPage: 10, ...props },
  })
}

const button = (wrapper: ReturnType<typeof mountPagination>, label: string) =>
  wrapper.find(`button[aria-label="${label}"]`)

describe('BasePagination', () => {
  it('shows the row total and page count', () => {
    const wrapper = mountPagination()

    expect(wrapper.text()).toContain('47 rows')
    expect(wrapper.text()).toContain('of 5')
  })

  it('disables first and previous on the first page', () => {
    const wrapper = mountPagination({ modelValue: 1 })

    expect(button(wrapper, 'First page').attributes('disabled')).toBeDefined()
    expect(button(wrapper, 'Previous page').attributes('disabled')).toBeDefined()
    expect(button(wrapper, 'Next page').attributes('disabled')).toBeUndefined()
    expect(button(wrapper, 'Last page').attributes('disabled')).toBeUndefined()
  })

  it('disables next and last on the last page', () => {
    const wrapper = mountPagination({ modelValue: 5 })

    expect(button(wrapper, 'Next page').attributes('disabled')).toBeDefined()
    expect(button(wrapper, 'Last page').attributes('disabled')).toBeDefined()
    expect(button(wrapper, 'First page').attributes('disabled')).toBeUndefined()
    expect(button(wrapper, 'Previous page').attributes('disabled')).toBeUndefined()
  })

  it('emits the right page for each navigation button', async () => {
    const wrapper = mountPagination({ modelValue: 3 })

    await button(wrapper, 'Next page').trigger('click')
    await button(wrapper, 'Previous page').trigger('click')
    await button(wrapper, 'First page').trigger('click')
    await button(wrapper, 'Last page').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[4], [2], [1], [5]])
  })

  it('emits the chosen page from the page selector', async () => {
    const wrapper = mountPagination({ modelValue: 1 })

    await wrapper.find('select[aria-label="Current page"]').setValue('4')

    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
  })

  it('does not emit when the selected page is already current', async () => {
    const wrapper = mountPagination({ modelValue: 2 })

    await wrapper.find('select[aria-label="Current page"]').setValue('2')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits update:itemsPerPage when the page size changes', async () => {
    const wrapper = mountPagination({ itemsPerPage: 10 })

    await wrapper.find('select[aria-label="Rows per page"]').setValue('25')

    expect(wrapper.emitted('update:itemsPerPage')).toEqual([[25]])
  })

  it('includes a custom page size in the options, sorted', () => {
    const wrapper = mountPagination({ itemsPerPage: 20 })
    const options = wrapper
      .findAll('select[aria-label="Rows per page"] option')
      .map((o) => o.text())

    expect(options).toEqual(['5', '10', '20', '25', '50', '100'])
  })

  it('shows the page size as text when readonly', () => {
    const wrapper = mountPagination({ itemsPerPageReadonly: true, itemsPerPage: 10 })

    expect(wrapper.find('select[aria-label="Rows per page"]').exists()).toBe(false)
    expect(wrapper.find('.page-size-value').text()).toBe('10')
  })

  it('disables every control and emits nothing while loading', async () => {
    const wrapper = mountPagination({ modelValue: 3, loading: true })

    for (const label of ['First page', 'Previous page', 'Next page', 'Last page']) {
      expect(button(wrapper, label).attributes('disabled')).toBeDefined()
    }
    expect(wrapper.find('select[aria-label="Current page"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('select[aria-label="Rows per page"]').attributes('disabled')).toBeDefined()

    await button(wrapper, 'Next page').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})