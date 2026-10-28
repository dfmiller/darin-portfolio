import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import BaseRichText from './BaseRichText.vue'

// jsdom has no layout engine; ProseMirror calls these when focusing/selecting.
beforeAll(() => {
  const rect = {
    x: 0, y: 0, width: 0, height: 0,
    top: 0, left: 0, right: 0, bottom: 0,
    toJSON() {},
  }
  const rects = { length: 0, item: () => null, [Symbol.iterator]: function* () {} }

  Range.prototype.getBoundingClientRect = () => rect as DOMRect
  Range.prototype.getClientRects = () => rects as unknown as DOMRectList
  document.elementFromPoint = () => null
})

const wrappers: VueWrapper[] = []

// The editor is created in onMounted, so wait for it before asserting.
async function mountEditor(props: Record<string, unknown> = {}) {
  const wrapper = mount(BaseRichText, { props, attachTo: document.body })
  wrappers.push(wrapper)
  await flushPromises()
  return wrapper
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
})

const toolbarButton = (wrapper: VueWrapper, label: string) =>
  wrapper.find(`button[aria-label="${label}"]`)

describe('BaseRichText', () => {
  it('renders the label and initial content', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Hello world</p>', label: 'Bio' })

    expect(wrapper.find('.editor-label').text()).toBe('Bio')
    expect(wrapper.find('.ProseMirror').text()).toContain('Hello world')
  })

  it('labels the editing area for assistive technology', async () => {
    const wrapper = await mountEditor({ label: 'Bio' })
    const editable = wrapper.find('.ProseMirror')

    expect(editable.attributes('aria-label')).toBe('Bio')
    expect(editable.attributes('aria-multiline')).toBe('true')
    expect(editable.attributes('contenteditable')).toBe('true')
  })

  it('shows a labelled formatting toolbar', async () => {
    const wrapper = await mountEditor({ label: 'Bio' })
    const toolbar = wrapper.find('[role="toolbar"]')

    expect(toolbar.exists()).toBe(true)
    expect(toolbar.attributes('aria-label')).toBe('Bio formatting')

    for (const label of [
      'Bold', 'Italic', 'Strikethrough', 'Text style',
      'Bullet list', 'Numbered list', 'Blockquote', 'Code block',
      'Undo', 'Redo',
    ]) {
      expect(toolbarButton(wrapper, label).exists(), label).toBe(true)
    }
  })

  it('hides the toolbar and locks the editor when not editable', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Read only</p>', editable: false })

    expect(wrapper.find('[role="toolbar"]').exists()).toBe(false)
    expect(wrapper.find('.ProseMirror').attributes('contenteditable')).toBe('false')
    expect(wrapper.find('.ProseMirror').text()).toContain('Read only')
  })

  it('shows the placeholder when empty', async () => {
    const wrapper = await mountEditor({ modelValue: '', placeholder: 'Write your bio…' })

    expect(wrapper.find('p[data-placeholder]').attributes('data-placeholder')).toBe(
      'Write your bio…',
    )
  })

  it('updates the editor when modelValue changes, without emitting', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>First</p>' })

    await wrapper.setProps({ modelValue: '<p>Second</p>' })
    await flushPromises()

    expect(wrapper.find('.ProseMirror').text()).toContain('Second')
    expect(wrapper.find('.ProseMirror').text()).not.toContain('First')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('emits HTML when a formatting button changes the content', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Item</p>' })

    await toolbarButton(wrapper, 'Bullet list').trigger('click')
    await flushPromises()

    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeTruthy()
    expect(events!.at(-1)![0]).toContain('<ul>')
    expect(events!.at(-1)![0]).toContain('Item')
  })

  it('reflects active formatting on the toolbar button', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Item</p>' })
    const bullet = () => toolbarButton(wrapper, 'Bullet list')

    expect(bullet().attributes('aria-pressed')).toBe('false')

    await bullet().trigger('click')

    // The toolbar re-renders a few frames after the editor changes.
    await vi.waitFor(() => {
      expect(bullet().attributes('aria-pressed')).toBe('true')
    })
    expect(bullet().classes()).toContain('active')
  })

  it('enables undo only after a change', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Item</p>' })
    const undo = () => toolbarButton(wrapper, 'Undo')

    expect(undo().attributes('disabled')).toBeDefined()

    await toolbarButton(wrapper, 'Bullet list').trigger('click')

    await vi.waitFor(() => {
      expect(undo().attributes('disabled')).toBeUndefined()
    })
  })

  it('cleans up without errors when unmounted', async () => {
    const wrapper = await mountEditor({ modelValue: '<p>Bye</p>' })

    expect(() => wrapper.unmount()).not.toThrow()
    wrappers.pop() // already unmounted, so afterEach shouldn't repeat it
  })
})