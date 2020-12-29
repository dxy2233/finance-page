import axios from 'axios'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API + '/api',
  baseURL: 'http://192.168.31.26:8999',
})

// service.interceptors.request.use(
//   (config) => {
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

service.interceptors.response.use(
  (response) => {
    console.log(response.data.type)

    if (response.data.type === 'application/octet-stream') {
      const blob = new Blob([response.data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      })
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      const name = decodeURIComponent(response.headers['content-disposition'])
      a.download = name.slice(name.indexOf('=') + 1)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(objectUrl)
      return 'ok'
    }
    const res = response.data
    return res
    // if (res.status === 'ok') return res
    // else {
    //   if (res.type === 'application/json') {
    //     Vue.prototype.$message({
    //       content: '系统异常，请联系管理员!',
    //       type: 'error',
    //       time: 5 * 1000,
    //     })
    //   } else if (res.status === 'tokenError') {
    //     const reStart = async () => {
    //       await store.dispatch('user/logout')
    //       router.push({ name: 'Login', params: { reset: true } })
    //     }
    //     reStart()
    //   } else {
    //     Vue.prototype.$message({
    //       content: res.message || 'error',
    //       type: 'error',
    //       time: 5 * 1000,
    //     })
    //   }
    //   return Promise.reject(res.message || 'error')
    // }
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
