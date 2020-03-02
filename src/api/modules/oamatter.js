import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 根据登录用户获取我的办事列表
function listByUser (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/listByUser'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 根据登录用户获取我的分派列表
function assignByUser (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/assignByUser'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}
// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oamatter/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 更改状态
function status (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/status'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oamatter/delete'),
    method: 'post',
    data: params
  })
}
const oamatter = {
    list,info,add,update,del,status,listByUser,assignByUser
}

export default  oamatter
