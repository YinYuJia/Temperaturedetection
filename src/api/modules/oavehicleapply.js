import isInteger from 'lodash/isInteger'
import http from '../../utils/httpRequest.js'

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oavehicleapply/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oavehicleapply/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oavehicleapply/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oavehicleapply/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oavehicleapply/delete'),
    method: 'post',
    data: params
  })
}
const oavehicleapply = {
  list,info,add,update,del
}

export default  oavehicleapply