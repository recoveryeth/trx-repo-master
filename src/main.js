import Vue from 'vue'
import App from './App.vue'
import 'amfe-flexible'
import router from './router'
import store from './store'
import  FastClick  from  'fastclick'
import filters from './filters'
import meta from 'vue-meta'
import VueI18n from 'vue-i18n'
import AsyncComputed from 'vue-async-computed'
import VueClipboard from 'vue-clipboard2'
import VueParticles from 'vue-particles'
import Cookies from 'js-cookie'
import _ from 'lodash'
import '@/assets/css/main.scss'
import '@/assets/css/vant.css'
import { SET_REF_INVITE_CODE, SET_CHANNEL, SET_IS_NO_WALLET, SET_WALLET } from './store/mutation-types'
import { WALLET_TRONLINK, WALLET_OTHER } from './config/wallet'
import { init, isAddress } from './utils/Wallet'
import { initHistory } from './utils/History'
import { Tabbar, TabbarItem, Tab, Tabs,Circle,CountDown, Slider, List, Icon} from 'vant'


Vue.config.productionTip = false

FastClick.attach(document.body)

let lang = Cookies.get('lang')
if (_.indexOf(['zh-TW','zh-CN','en','ko','ru-RU'], lang) == -1) {
  lang = store.state.app.lang
}
const url_params = new URLSearchParams(window.location.search)

if(url_params.get('lang') != null){
  if(['zh-TW','zh-CN','en','ko','ru-RU'].indexOf(url_params.get('lang')) > -1){
    lang = url_params.get('lang')
  }else{
    lang = 'en'
  }
}


/* vant */
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Circle)
Vue.use(CountDown)
Vue.use(Slider)
Vue.use(List)
Vue.use(Icon)
Vue.use(VueParticles)


/* i18n config */
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: lang,
  messages: {
    'en': require('@/assets/lang/en.json'),
    'zh-CN': require('@/assets/lang/zh-CN.json'),
    'zh-TW': require('@/assets/lang/zh-TW.json'),
    'ko': require('@/assets/lang/ko.json'),
    'ru-RU': require('@/assets/lang/ru-RU.json'),
  }
})


/* AsyncComputed */
Vue.use(AsyncComputed)

Vue.use(VueClipboard)

let ref = url_params.get('ref')
let utm_source = url_params.get('utm_source')

ref = window.atob(ref)
console.log("ref" + ref);
store.commit(SET_REF_INVITE_CODE, ref)

if (utm_source != null) {
  store.commit(SET_CHANNEL, utm_source)
}


function check_wallet(){
  let is_wallet = !!window.tronWeb
  let wallet = ''
  if(is_wallet) {
    switch(true){
      case Boolean(window.tronWeb&&window.tronWeb.ready&&window.tronWeb.defaultAddress.base58):
        wallet = WALLET_TRONLINK
        break;
    }
  }
  if(wallet=='') is_wallet = false;
  store.dispatch('update_env', {
    wallet,
    is_wallet
  })
  return is_wallet
}

async function loop_check(){
  let i = 0
  let is_wallet = false
  while(!(is_wallet = check_wallet())){
    if(i >= 10){
      break
    }
    await sleep(300)
    i++;
  }
  return is_wallet
}

function sleep (n){
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove()
    }, n)
  })
}



// function is_weixin() {
//   let ua = navigator.userAgent.toLowerCase()
//   if(ua.match(/MicroMessenger/i)=="micromessenger") {
//     return true
//   } else {
//     return false
//   }
// }

async function connect(){
  const is_wallet = await loop_check()

  /**
   * If you try to jump or open
   */
  if(!is_wallet){
    setTimeout(function() {
      if(!document.hidden) {
        store.commit(SET_IS_NO_WALLET, true)
      }
    }, 5000)
  }

  await init()
  await initHistory()
}

Vue.prototype.$stringFormat = function stringFormat (formatted, args) {
  for (let i = 0; i < args.length; i++) {
    let regexp = new RegExp('\\{' + i + '\\}', 'gi')
    formatted = formatted.replace(regexp, args[i])
  }
  return formatted
}

connect()

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
