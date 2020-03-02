import request from '@/utils/httpRequest'
import loadash from 'lodash'
// 获取列表
export function xmkList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/xmkList'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function xmkExport (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/xmkExport'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function xmkTj (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/xmkTj'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function xmsbTj (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/xmsbTj'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function wskTj (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/wskTj'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function rckTj (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglQuery/rckTj'),
    method: 'get',
    params: request.adornParams(params)
  })
}
