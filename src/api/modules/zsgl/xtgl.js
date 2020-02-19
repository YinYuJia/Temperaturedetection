import request from '@/utils/httpRequest'
import loadash from 'lodash'

export function xxtsList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxxts/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function xxtsInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglxxts/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
export function xxtsUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglxxts/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
