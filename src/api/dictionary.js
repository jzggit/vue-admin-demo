import request from '@/utils/request'

// 根据字典类型获取字典数据
export function getDictList(data) {
  return request({
    url: '/sys/dict/getDictList', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

// 保存字典数据
export function saveDict(data) {
  return request({
    url: '/sys/dict/saveDict', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
