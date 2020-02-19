import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oajournal/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oajournal/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oajournal/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oajournal/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 更改状态
function status (params) {
  return http({
    url: http.adornUrl('/oa/oajournal/status'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oajournal/delete'),
    method: 'post',
    data: params
  })
}
const oajournal = {
  list,info,add,update,del,status
}

export default  oajournal


