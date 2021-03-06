import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oainvoicei/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oainvoicei/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oainvoicei/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oainvoicei/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oainvoicei/delete'),
    method: 'post',
    data: params
  })
}
const oainvoicei = {
  list,info,add,update,del
}

export default  oainvoicei