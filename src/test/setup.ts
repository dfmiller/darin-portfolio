import { vi } from 'vitest'

vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)

vi.stubGlobal('visualViewport', {
  width: 1024,
  height: 768,
  addEventListener() {},
  removeEventListener() {},
})