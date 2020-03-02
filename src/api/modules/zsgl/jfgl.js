import request from '@/utils/httpRequest'
import loadash from 'lodash'

export function jfszList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgljfgz/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
//保存
export function jfszAdd (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgljfgz/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
//查询
export function jfszInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsgljfgz/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function jfszUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgljfgz/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
//===================================
export function jfcxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglryjf/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function jfmxList (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglryjf/jfmxList'),
    method: 'get',
    params: request.adornParams(id)
  })
}
//===============
export function jfCountList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglryjflog/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function jfCount (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglryjflog/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
