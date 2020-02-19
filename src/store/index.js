import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import user from './modules/user'
import options from './modules/options'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    options
  },
  strict: process.env.NODE_ENV !== 'production'
})
