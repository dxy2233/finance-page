import { AxiosPromise } from 'axios'
import request from '@/utils/request'

export function upload(data: FormData): AxiosPromise {
  return request({
    url: '/api/upload',
    method: 'post',
    responseType: 'blob',
    data,
  })
}
