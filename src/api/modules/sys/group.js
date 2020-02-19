import request from '@/utils/httpRequest'
import loadash from 'lodash'
// 获取列表
export function groupList (params) {
  return request({
    url: request.adornUrl('/sys/group/list'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function groupAllList (params) {
  return request({
    url: request.adornUrl('/sys/group/allList'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function groupInfo (id) {
  return request({
    url: request.adornUrl('/sys/group/info' + (loadash.isInteger(id) ? `/${id}` : '')),
    method: 'get',
    params: request.adornParams(id)
  })
}

export function groupData (params) {
  return request({
    url: request.adornUrl('/sys/group/groupData'),
    method: 'get',
    params: request.adornParams(params)
  })
}

// 添加部门
export function groupAdd (params) {
  return request({
    url: request.adornUrl('/sys/group/save'),
    method: 'post',
    data: request.adornData(params)
  })
}

// 部门修改
export function groupUpdate (params) {
  return request({
    url: request.adornUrl('/sys/group/update'),
    method: 'put',
    data: request.adornData(params)
  })
}

export function groupCheck (params) {
  return request({
    url: request.adornUrl('/sys/group/groupCheck'),
    method: 'get',
    params: request.adornParams(params)
  })
}

export function doGroupDetele(gCode){
  return request({
    url: request.adornUrl('/sys/group/doDetele' +  `/${gCode}`),
    method: 'get',
    params: request.adornParams(gCode)
  })
}

export function groupByCode (params) {
  return request({
    url: request.adornUrl('/sys/group/groupByCode'),
    method: 'get',
    params: request.adornParams(params)
  })
}

/*====================================================================================================================*/
export function groupChangeTree(data){
  var res = []
  var temp = {}
  let id = "gCode";
  let pid = "gpCode";
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
    data[i]['value'] = data[i].gCode;
    data[i]['label'] = data[i].gName;
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res;
}

export function groupTreeWithCode(data){
  var res = []
  var temp = {}
  let id = "gCode";
  let pid = "gpCode";
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
    data[i]['value'] = data[i].gCode;
    data[i]['label'] = data[i].gName;
  }
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  return res;
}
