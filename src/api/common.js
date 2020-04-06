import request from '@/utils/request'

// 根据字典类型获取字典数据
export function getDictByType(dictType) {
  console.log('---------')
  return request({
    url: '/sys/dict/getDictByType', // '/vue-admin-template/user/login',
    method: 'get',
    params: { dictType }
  })
}
