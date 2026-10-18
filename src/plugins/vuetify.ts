
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2563eb',
          secondary: '#475569',
          background: '#f7f8fa',
          surface: '#ffffff',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#8ab4ff',
          secondary: '#b8c4d6',
          background: '#101820',
          surface: '#18232e',
        },
      },
    },
  },
})
