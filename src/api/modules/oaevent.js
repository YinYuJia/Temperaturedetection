import isInteger from 'lodash/isInteger'
import http from "../../utils/httpRequest";

// 获取列表
function list (params) {
  return http({
    url: http.adornUrl('/oa/oaevent/list'),
    method: 'get',
    params: http.adornParams(params, 'get')
  })
}

// 获取信息
function info (id) {
  return http({
    url: http.adornUrl('/oa/oaevent/info' + (isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: http.adornParams({}, 'get')
  })
}

// 添加
function add (params) {
  return http({
    url: http.adornUrl('/oa/oaevent/save'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 修改
function update (params) {
  return http({
    url: http.adornUrl('/oa/oaevent/update'),
    method: 'post',
    data: http.adornData(params)
  })
}

// 删除
function del (params) {
  return http({
    url: http.adornUrl('/oa/oaevent/delete'),
    method: 'post',
    data: params
  })
}

const oaevent = {
  list,info,add,update,del
}

export default  oaevent
