
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customDark',
    themes: {
      customDark: {
        dark: true,
        colors: {
          background: '#0b1020',
          surface: '#121a2d',
          primary: '#60a5fa',
        },
      },
    },
  },
})
