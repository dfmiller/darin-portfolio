
import { createApp, type Component } from 'vue'
import './style.css'

import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)
const baseComponents = import.meta.glob<{ default: Component }>('./components/Base/Base*.vue', {
  eager: true,
})

for (const [path, module] of Object.entries(baseComponents)) {
  const name = path.slice(path.lastIndexOf('/') + 1).replace(/\.vue$/, '')
  app.component(name, module.default)
}

app
  .use(vuetify)
  .use(router)
  .mount('#app')
