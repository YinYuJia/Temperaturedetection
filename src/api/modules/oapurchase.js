import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oapurchase/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oapurchase/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oapurchase/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oapurchase/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oapurchase/delete'),
    method: 'post',
    data: params
  })
}
const oapurchase = {
  list,info,add,update,del
}

export default  oapurchase