import request from '@/utils/httpRequest'
// 获取代码信息
export function dmList (params) {
  return request({
    url: request.adornUrl('/sys/config/listByDm'),
    method: 'get',
    params: request.adornParams(params),
  })
}

