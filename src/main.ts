import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

//import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
//import { fas } from '@fortawesome/free-solid-svg-icons'
import 'flowbite';

//library.add(fas)

document.documentElement.classList.toggle('dark',
  localStorage.theme === 'dark'
    || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
