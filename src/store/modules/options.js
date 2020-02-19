export default {
  namespaced: true,
  state:{
    options:undefined
  },
  mutations:{
    updateOptions (state, options) {
      state.options = options
    },
  }
}
