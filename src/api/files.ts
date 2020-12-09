import request from '@/utils/request'
import { AxiosPromise } from 'axios'

export function upload(data: FormData): AxiosPromise {
  return request({
    url: '/index',
    method: 'post',
    responseType: 'blob',
    data: data,
  })
}
