import request from '@/utils/httpRequest'
import loadash from 'lodash'
// 获取列表
export function xxsbList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function xmsbExport (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/exportList'),
    method: 'get',
    params: request.adornParams(params)
  })
}

//保存
export function addXxsb (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
//查询
export function xxsbInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function updateXxsb (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
export function deleteTj (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/updateTj'),
    method: 'put',
    data: request.adornData(params)
  })
}
//审核情况查询
export function xxsbSpQuery (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/xxsbSpQuery'),
    method: 'get',
    params: request.adornParams(params)
  })
}
//认领情况查询
export function xxsbRlQuery (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/xxsbRlQuery'),
    method: 'get',
    params: request.adornParams(params)
  })
}
//========================================================
export function xxspList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsp/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function userList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsp/getAllUser'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function saveSpxx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsp/save'),
    method: 'post',
    data: request.adornData(params)
  })
}

export function checkSpxx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsp/saveCheck'),
    method: 'post',
    data: request.adornData(params)
  })
}

export function xxspInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsp/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
//========================================================
export function xxrlList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/xxrlList'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function xxrlAdd (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmsb/xxrl'),
    method: 'post',
    data: request.adornData(params)
  })
}
//===========================================================
export function xxgjList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmgj/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function xxgjmxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmgj/gjmxList'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function addGjmx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmgj/addGjmx'),
    method: 'post',
    data: request.adornData(params)
  })
}
export function backGjxx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxmgj/backGjxx'),
    method: 'put',
    data: request.adornData(params)
  })
}
