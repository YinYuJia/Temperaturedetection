import http from './httpRequest.js'

// 获取列表
export function getOptions (params) {
  return http({
    url: http.adornUrl('/sys/config/listByDm'),
    method: 'get',
    params: http.adornParams({dmlx:params})
  })
}

// 获取列表
export function getApprovalUserList () {
  return http({
    url: http.adornUrl('/sys/user/approvalList'),
    method: 'get',
  })
}

// 获取列表
export function getDownUserList () {
  return http({
    url: http.adornUrl('/sys/user/downList'),
    method: 'get',
  })
}

// 获取事项人列表
export function getMatterUserList () {
  return http({
    url: http.adornUrl('/sys/user/matterList'),
    method: 'get',
  })
}
