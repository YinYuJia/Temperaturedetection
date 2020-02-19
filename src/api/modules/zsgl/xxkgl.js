import request from '@/utils/httpRequest'
import loadash from 'lodash'

export function wsxxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglwsxx/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
//保存
export function wsxxAdd (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglwsxx/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
//查询
export function wsxxInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglwsxx/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function wsxxUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglwsxx/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
//=====================================================
export function rcxxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglrcxx/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
//保存
export function rcxxAdd (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglrcxx/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
//查询
export function rcxxInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglrcxx/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function rcxxUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglrcxx/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
