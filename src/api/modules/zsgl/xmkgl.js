import request from '@/utils/httpRequest'
import loadash from 'lodash'

export function dykList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function dykBack (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/dykBack'),
    method: 'put',
    data: request.adornData(params)
  })
}

export function dykInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
export function dykAdd (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/save'),
    method: 'post',
    data: request.adornData(params)
  })
}
// 修改
export function dykUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/update'),
    method: 'put',
    data: request.adornData(params)
  })
}
//=====================================
export function qykList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglqyk/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function qykInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglqyk/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function qykUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglqyk/update'),
    method: 'put',
    data: request.adornData(params)
  })
}

//====================================
export function ldkList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglldk/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
export function ldkInfo (id) {
  return request({
    url: request.adornUrl('/zsgl/zsglldk/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}
// 修改
export function ldkUpdate (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglldk/update'),
    method: 'put',
    data: request.adornData(params)
  })
}

//=====================================
export function addJzmx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/addJzmx'),
    method: 'post',
    data: request.adornData(params)
  })
}
export function jzmxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsgldyk/jzmxList'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function uploadWj(params){
  return request({
    url: request.adornUrl('/zsgl/zsglfjxx/uploadFile'),
    method: 'post',
    data: params,
    headers:{'Content-Type': 'multipart/form-data'}
  })
}

export function addWjxx (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglfjxx/save'),
    method: 'post',
    data: request.adornData(params)
  })
}

export function deleteTempWj(params){
  return request({
    url: request.adornUrl('/zsgl/zsglfjxx/deleteFile'),
    method: 'post',
    data: params,
    headers:{'Content-Type': 'multipart/form-data'}
  })
}
export function wjxxList (params) {
  return request({
    url: request.adornUrl('/zsgl/zsglfjxx/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}
