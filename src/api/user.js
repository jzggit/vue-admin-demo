import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/user/login', // '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  console.log(token)
  return request({
    url: '/sys/user/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getList(data) {
  console.log('can-', data)
  return request({
    url: '/sys/user/findAll',
    method: 'post',
    data
  })
}
