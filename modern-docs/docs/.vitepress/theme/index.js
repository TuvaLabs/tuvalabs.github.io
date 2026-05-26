import DefaultTheme from 'vitepress/theme'
import LiveEditor from './components/LiveEditor.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('LiveEditor', LiveEditor)
  }
}
