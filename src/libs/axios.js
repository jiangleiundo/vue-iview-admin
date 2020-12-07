import axios from 'axios'
import store from '@/store'
import {Spin} from 'view-design'
const addErrorLog = errorInfo => {
  const {statusText, status, request: {responseURL}} = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    // this.queue = {}
    this.queue = [] // 20201126存放地址队列
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    // delete this.queue[url]
    // if (!Object.keys(this.queue).length) {
    //   Spin.hide()
    // }
    this.queue.pop() // 弹出遵循先进先出原则
    setTimeout(() => { // 延迟100ms看看是否是否有嵌套接口
      if (!this.queue.length) { // 如果队列里还有没有完成的请求就不关闭loading效果
        Spin.hide()
      }
    }, 100)
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      // }
      // this.queue[url] = true

      this.queue.push(url) // 把url添加到队列
      if (this.queue.length) { // 如果队列中有值就打开loading
        Spin.show({
          render: h => {
            return h('div', [
              h('Icon', {
                'class': 'spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 30
                }
              }),
              h('div', '加载中...')
            ])
          }
        })
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url) // 成功响应关闭loading
      const {data, status} = res
      return {data, status}
    }, error => {
      this.destroy(url) // 响应失败关闭loading
      let errorInfo = error.response
      if (!errorInfo) {
        const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: {responseURL: config.url}
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
