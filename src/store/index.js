import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

import app from './modules/app'
import base from './modules/base'
import wallet from './modules/wallet'
import statistic from './modules/statistic'

Vue.use(Vuex)


const getters = {}


const actions = {}


const mutations = {}

function initPersistedState(){
  let config = {
    key: 'base',
    paths: ['base']
  }
  return createPersistedState(config)
}

export default new Vuex.Store({
  getters,
  actions,
  mutations,
  plugins: [
    initPersistedState()
  ],
  modules: {
    app,
    base,
    wallet,
    statistic
  }
})
