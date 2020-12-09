import axios from 'axios'

const service = axios.create({
  baseURL: 'http://192.168.1.122:8999',
})

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
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
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service
