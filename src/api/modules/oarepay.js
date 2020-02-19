import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oarepay/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取列表
function noList (params) {
  return http({
    url: http.adornUrl('/oa/oarepay/noList'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oarepay/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oarepay/save'),
    method: 'post',
    data: http.adornParams(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oarepay/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oarepay/delete'),
    method: 'post',
    data:params
  })
}
const oarepay = {
  noList,list,info,add,update,del
}

export default  oarepay
