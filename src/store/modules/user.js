export default {
  namespaced: true,
  state: {
    userId: 0,
    name: '',
    userName:'',
    gCode:'',
    gName:'',
    scsj:'',
    scip:'',
    isMobile:'0',
    roleId:''
  },
  mutations: {
    updateId (state, userId) {
      state.userId = userId
    },
    updateName (state, name) {
      state.name = name
    },
    updateUserName (state, userName) {
      state.userName = userName
    },
    updateGcode(state,gCode){
      state.gCode = gCode
    },
    updateGname(state,gName){
      state.gName = gName
    },
    updateScsj(state,scsj){
      state.scsj = scsj
    },
    updateScip(state,scip){
      state.scip = scip
    },
    updateMobile(state,mobile){
      state.isMobile = mobile
    },
    updateRoleId(state,roleId){
      state.roleId = roleId
    },
  }
}
