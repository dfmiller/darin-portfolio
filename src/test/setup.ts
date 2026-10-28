import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { vi } from 'vitest'

// Initialize Vuetify for all tests
const vuetify = createVuetify({
  components,
  directives,
})

// Register plugins globally for Vue Test Utils
config.global.plugins = [vuetify]

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
