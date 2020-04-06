import request from '@/utils/request'

// 获取行政区划树型数据
export function getList(data) {
  return request({
    url: '/sys/zoning/getTreeTable', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
// 获取行政区划数据
export function getQueryList(data) {
  return request({
    url: '/sys/zoning/query', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
// 保存行政区划数据
export function saveZoning(data) {
  return request({
    url: '/sys/zoning/saveZoning', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
// 更新行政区划数据
export function updateZoning(data) {
  return request({
    url: '/sys/zoning/updateZoning', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
